"use client"

import { useCart } from "@/app/context/CartContext"
import { supabase } from "@/lib/supabase"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  image_data: string | null
  is_available: boolean
}

export default function RestaurantScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const { addToCart, setStallId } = useCart()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStallId, setCurrentStallId] = useState<string | null>(null)
  const name = Array.isArray(params.name) ? params.name[0] : (params.name ?? "")
  const image = Array.isArray(params.image) ? params.image[0] : (params.image ?? "")
  const tag = Array.isArray(params.tag) ? params.tag[0] : (params.tag ?? "")
  const rating = Array.isArray(params.rating) ? params.rating[0] : (params.rating ?? "")
  const fee = Array.isArray(params.fee) ? params.fee[0] : (params.fee ?? "")
  const time = Array.isArray(params.time) ? params.time[0] : (params.time ?? "")

  // Fetch menu items for the selected stall
  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true)
      
      // Return early if no stall name provided
      if (!name) {
        setMenuItems([])
        return
      }
      
      // Fetch the stall by the name passed from params
      const { data: stallData, error: stallError } = await supabase
        .from("stalls")
        .select("id")
        .eq("name", name)
        .eq("is_active", true)
        .single()

      if (stallError || !stallData) {
        console.error("Error fetching stall:", stallError)
        setMenuItems([])
        return
      }

      // Store the stall ID and set it in cart context
      setCurrentStallId(stallData.id)
      setStallId(stallData.id)

      // Fetch menu items for this stall
      const { data: foodsData, error: foodsError } = await supabase
        .from("foods")
        .select("*")
        .eq("stall_id", stallData.id)
        .eq("is_available", true)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("name", { ascending: true })

      if (foodsError) {
        console.error("Error fetching menu items:", foodsError)
        setMenuItems([])
      } else {
        setMenuItems(foodsData || [])
      }
    } catch (error) {
      console.error("Error in fetchMenuItems:", error)
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }, [name, setStallId])

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  useFocusEffect(
    useCallback(() => {
      fetchMenuItems()
    }, [fetchMenuItems])
  )
  const LOCAL_IMAGES: Record<string, any> = {
    "bambam.png": require("@/assets/images/bambam.png"),
    "puting_bahay.png": require("@/assets/images/puting_bahay.png"),
    "RC.png": require("@/assets/images/RC.png"),
    "NOMO.png": require("@/assets/images/NOMO.png"),
    "noodle_house.png": require("@/assets/images/noodle_house.png"),
    "kuya_platter.png": require("@/assets/images/kuya_platter.png"),
    "cocina.png": require("@/assets/images/cocina.png"),
    "JBI.png": require("@/assets/images/JBI.png"),
    "kuyakim.png": require("@/assets/images/kuyakim.png"),
    "taptap.png": require("@/assets/images/taptap.png"),
    "flavorful_fiesta.png": require("@/assets/images/flavorful_fiesta.png"),
    "bitebox.png": require("@/assets/images/bitebox.png"),
  }

  const resolvedImage = LOCAL_IMAGES[image] ?? (String(image).startsWith("http") ? { uri: String(image) } : undefined)

  return (
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      {/* Restaurant Banner */}
      <View style={{ position: "relative", width: "100%", height: 180 }}>
        <Image source={resolvedImage} style={{ width: "100%", height: "100%" }} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.restaurantName}>{String(name)}</Text>
          <Text style={styles.restaurantMeta}>
            {tag ? String(tag) + " | " : ""}★ {String(rating)} ₱{String(fee)} delivery • {String(time)} min
          </Text>
        </View>
      </View>
      {/* Menu List */}
      <View style={{ padding: 18 }}>
        <Text style={styles.menuHeader}>Menu</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={YELLOW_DARK} />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items available</Text>
          </View>
        ) : (
          menuItems.map((item) => (
            <View style={styles.menuCard} key={item.id}>
              {item.image_data ? (
                <Image source={{ uri: item.image_data }} style={styles.menuImage} />
              ) : item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.menuImage} />
              ) : (
                <View style={[styles.menuImage, { backgroundColor: YELLOW_LIGHT, justifyContent: "center", alignItems: "center" }]}>
                  <Text style={{ color: "#999" }}>No Image</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.menuName}>{item.name}</Text>
                {item.description && <Text style={styles.menuDesc}>{item.description}</Text>}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                  <Text style={styles.menuPrice}>₱{Number(item.price).toFixed(2)}</Text>
                  <TouchableOpacity 
                    style={[styles.addBtn, !item.is_available && styles.addBtnDisabled]} 
                    onPress={() => {
                      if (item.is_available) {
                        // Add item to cart with quantity 1
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          qty: 1,
                          image_url: item.image_url ?? undefined,
                          image_data: item.image_data ?? undefined,
                        })
                        
                        // Show confirmation alert
                        Alert.alert(
                          "Added to Cart",
                          `${item.name} has been added to your cart`,
                          [
                            {
                              text: "Continue Shopping",
                              style: "default",
                            },
                            {
                              text: "Go to Cart",
                              style: "default",
                              onPress: () => router.push("/(tabs)/cart"),
                            },
                          ]
                        )
                      }
                    }}
                    disabled={!item.is_available}
                  >
                    <Text style={styles.addBtnText}>{item.is_available ? "Add" : "Unavailable"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  bannerTextWrap: {
    position: "absolute",
    bottom: 16,
    left: 18,
    right: 18,
  },
  restaurantName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textShadowColor: "#0009",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  restaurantMeta: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    textShadowColor: "#0007",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  menuHeader: {
    fontWeight: "700",
    fontSize: 21,
    marginBottom: 16,
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
  menuCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: YELLOW_LIGHT,
  },
  menuName: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: "#1a1a1a",
  },
  menuDesc: {
    color: "#777",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  menuPrice: {
    color: YELLOW_DARK,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
  },
  addBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: YELLOW_DARK,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    paddingVertical: 40,
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
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
})
