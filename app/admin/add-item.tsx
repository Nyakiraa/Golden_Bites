"use client"

import { supabase } from "@/lib/supabase"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import * as FileSystem from "expo-file-system/legacy"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const YELLOW_DARK = "#F2BC2B"
const YELLOW_BG = "#FFF9E6"
const CREAM_BG = "#FFFEF5"

export default function AddItemScreen() {
  const router = useRouter()
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [stallId, setStallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Fetch stall ID on mount
  useEffect(() => {
    const fetchStallId = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error("Error getting user:", userError)
          return
        }

        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("stall_id")
          .eq("user_id", user.id)
          .maybeSingle()

        if (adminData && !adminError) {
          setStallId(adminData.stall_id)
        }
      } catch (error) {
        console.error("Error fetching stall ID:", error)
      }
    }

    fetchStallId()
  }, [])

  // Upload a local image file to Supabase Storage as PNG and return its public URL
  const uploadImageToSupabase = async (imageUri: string): Promise<string | null> => {
    if (!stallId) {
      Alert.alert("Error", "Stall ID not found. Please try again.")
      return null
    }

    try {
      setUploading(true)

      // Read the picked file as base64. Some TS versions don't expose EncodingType,
      // so we pass the encoding as a string literal.
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64" as any,
      })

      // Generate a unique filename inside the menu-images bucket
      const timestamp = Date.now()
      const sanitizedItemName = itemName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "item"
      const fileName = `${stallId}/${sanitizedItemName}_${timestamp}.png`

      // Convert base64 string to binary Uint8Array
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Upload to Supabase Storage bucket "menu-images"
      const { error } = await supabase.storage
        .from("menu-images")
        .upload(fileName, bytes, {
          contentType: "image/png",
          upsert: false,
        })

      if (error) {
        console.error("Error uploading image to Supabase:", error)
        Alert.alert("Error", "Failed to upload image. Please try again.")
        return null
      }

      // Get the public URL for this file
      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData?.publicUrl || null
      if (!publicUrl) {
        Alert.alert("Error", "Failed to get public image URL. Please try again.")
      }

      return publicUrl
    } catch (error: any) {
      console.error("Error in uploadImageToSupabase:", error)
      Alert.alert("Error", "Failed to upload image. Please try again.")
      return null
    } finally {
      setUploading(false)
    }
  }

  const pickImage = async (isMain: boolean = true) => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "Sorry, we need camera roll permissions to upload images!")
        return
      }

      // Launch image picker (images only). This uses MediaTypeOptions.Images,
      // which is marked deprecated but still works correctly with this SDK.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: isMain ? [1, 1] : [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        if (isMain) {
          // Show a local preview while uploading
          setImageUri(asset.uri)

          // Upload to Supabase Storage and store the public URL so all devices can see it
          const publicUrl = await uploadImageToSupabase(asset.uri)
          if (publicUrl) {
            setImageUrl(publicUrl)
          }
        }
      }
    } catch (error: any) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  const handleSave = async () => {
    if (!itemName.trim()) {
      Alert.alert("Error", "Please enter an item name")
      return
    }

    if (!price.trim()) {
      Alert.alert("Error", "Please enter a price")
      return
    }

    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ""))
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price")
      return
    }

    if (!stallId) {
      Alert.alert("Error", "Stall ID not found. Please try again.")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("foods")
        .insert([
          {
            stall_id: stallId,
            name: itemName.trim(),
            description: description.trim() || null,
            price: priceNum,
            image_url: imageUrl.trim() || null,
            category: category.trim() || null,
            is_available: true,
            display_order: null,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error adding food item:", error)
        Alert.alert("Error", `Failed to add item: ${error.message}`)
        return
      }

      Alert.alert("Success", "Item added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    } catch (error: any) {
      console.error("Error in handleSave:", error)
      Alert.alert("Error", error.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RC FOOD STALL</Text>
        <View style={styles.headerIcon}>
          <Image
            source={require("@/assets/images/RC.png")}
            style={styles.stallIcon}
            contentFit="contain"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add New Items</Text>

        {/* Item Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ITEM NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Chicken Fillet"
            placeholderTextColor="#999"
            value={itemName}
            onChangeText={setItemName}
            editable={!loading}
          />
        </View>

        {/* Upload Photo/Video */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>UPLOAD PHOTO/VIDEO</Text>
          <View style={styles.uploadContainer}>
            <TouchableOpacity 
              style={styles.mainUploadBox} 
              onPress={() => pickImage(true)}
              disabled={loading || uploading}
            >
              {imageUri || imageUrl ? (
                <Image 
                  source={{ uri: imageUri || imageUrl }} 
                  style={styles.uploadImage} 
                  contentFit="cover" 
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="cloud-upload" size={32} color="#999" />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.sideUploadBoxes}>
              <TouchableOpacity 
                style={styles.sideUploadBox}
                onPress={() => pickImage(false)}
                disabled={loading || uploading}
              >
                <MaterialIcons name="cloud-upload" size={24} color="#999" />
                <Text style={styles.uploadText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sideUploadBox}
                onPress={() => pickImage(false)}
                disabled={loading || uploading}
              >
                <MaterialIcons name="cloud-upload" size={24} color="#999" />
                <Text style={styles.uploadText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={[styles.input, styles.urlInput]}
            placeholder="Or enter image URL (optional)"
            placeholderTextColor="#999"
            value={imageUrl}
            onChangeText={setImageUrl}
            editable={!loading && !uploading}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DESCRIPTION (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter item description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            editable={!loading}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>CATEGORY (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Main Course, Breakfast, Snacks"
            placeholderTextColor="#999"
            value={category}
            onChangeText={setCategory}
            editable={!loading}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PRICE</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="50"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              editable={!loading}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Item"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM_BG,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stallIcon: {
    width: 32,
    height: 32,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  uploadContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  mainUploadBox: {
    width: 200,
    height: 200,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  uploadImage: {
    width: "100%",
    height: "100%",
  },
  uploadPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sideUploadBoxes: {
    flex: 1,
    gap: 12,
  },
  sideUploadBox: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  urlInput: {
    marginTop: 0,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  saveButton: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
})

