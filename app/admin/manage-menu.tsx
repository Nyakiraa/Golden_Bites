"use client"

import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Image } from "expo-image"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { supabase } from "@/lib/supabase"

interface FoodItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  is_available: boolean
  display_order: number | null
}

const YELLOW_DARK = "#F2BC2B"
const YELLOW_BG = "#FFF9E6"
const CREAM_BG = "#FFFEF5"

export default function ManageMenuScreen() {
  const router = useRouter()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [stallId, setStallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("Error getting user:", userError)
        setLoading(false)
        return
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("stall_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (adminError || !adminData) {
        console.error("Error fetching admin record:", adminError)
        setLoading(false)
        return
      }

      setStallId(adminData.stall_id)

      const { data: foodsData, error: foodsError } = await supabase
        .from("foods")
        .select("*")
        .eq("stall_id", adminData.stall_id)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("name", { ascending: true })

      if (foodsError) {
        console.error("Error fetching foods:", foodsError)
        Alert.alert("Error", "Failed to load menu items")
      } else {
        setFoods(foodsData || [])
      }
    } catch (error) {
      console.error("Error in fetchFoods:", error)
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  useFocusEffect(
    useCallback(() => {
      fetchFoods()
    }, [fetchFoods])
  )

  const handleDelete = (item: FoodItem) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("foods")
                .delete()
                .eq("id", item.id)

              if (error) {
                console.error("Error deleting item:", error)
                Alert.alert("Error", "Failed to delete item")
              } else {
                Alert.alert("Success", "Item deleted successfully")
                fetchFoods()
              }
            } catch (error) {
              console.error("Error in handleDelete:", error)
              Alert.alert("Error", "An unexpected error occurred")
            }
          },
        },
      ]
    )
  }

  const handleToggleAvailability = async (item: FoodItem) => {
    try {
      const { error } = await supabase
        .from("foods")
        .update({ is_available: !item.is_available })
        .eq("id", item.id)

      if (error) {
        console.error("Error updating availability:", error)
        Alert.alert("Error", "Failed to update availability")
      } else {
        fetchFoods()
      }
    } catch (error) {
      console.error("Error in handleToggleAvailability:", error)
      Alert.alert("Error", "An unexpected error occurred")
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Menu</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push("/admin/add-item")}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={YELLOW_DARK} />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : foods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="restaurant-menu" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>No menu items yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first item</Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => router.push("/admin/add-item")}
            >
              <Text style={styles.emptyAddButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.menuList}>
            {foods.map((food) => (
              <View 
                key={food.id} 
                style={[
                  styles.menuItem,
                  !food.is_available && styles.menuItemUnavailable
                ]}
              >
                {food.image_url ? (
                  <Image
                    source={{ uri: food.image_url }}
                    style={styles.menuItemImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.menuItemImagePlaceholder}>
                    <MaterialIcons name="restaurant" size={32} color="#E0E0E0" />
                  </View>
                )}
                <View style={styles.menuItemInfo}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{food.name}</Text>
                    {!food.is_available && (
                      <View style={styles.unavailableBadge}>
                        <Text style={styles.unavailableText}>Unavailable</Text>
                      </View>
                    )}
                  </View>
                  {food.description && (
                    <Text style={styles.menuItemDescription} numberOfLines={2}>
                      {food.description}
                    </Text>
                  )}
                  <View style={styles.menuItemFooter}>
                    <Text style={styles.menuItemPrice}>₱{Number(food.price).toFixed(2)}</Text>
                    {food.category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{food.category}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.menuItemActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => router.push({
                      pathname: "/admin/edit-item",
                      params: { id: food.id }
                    })}
                  >
                    <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.toggleButton]}
                    onPress={() => handleToggleAvailability(food)}
                  >
                    <MaterialIcons 
                      name={food.is_available ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(food)}
                  >
                    <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: YELLOW_DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: YELLOW_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  menuList: {
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  menuItemUnavailable: {
    opacity: 0.6,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  menuItemImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemInfo: {
    flex: 1,
    gap: 8,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
  },
  unavailableBadge: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  menuItemDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    lineHeight: 20,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
  categoryBadge: {
    backgroundColor: YELLOW_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },
  menuItemActions: {
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: YELLOW_DARK,
  },
  toggleButton: {
    backgroundColor: "#666",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
  },
})

