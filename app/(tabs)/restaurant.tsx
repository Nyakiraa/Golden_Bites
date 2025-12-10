"use client"

import { useCart } from "@/app/context/CartContext"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { supabase } from "@/lib/supabase"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

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
  const { addToCart, toggleFavorite, isFavorited, setStallId: setCartStallId } = useCart()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stallId, setStallId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const ITEMS_PER_PAGE = 5
  
  const name = Array.isArray(params.name) ? params.name[0] : (params.name ?? "")
  const passedStallId = Array.isArray(params.id) ? params.id[0] : (params.id ?? null)
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
      
      // Use passed stall id if available, otherwise find by name
      let stallLookupId = passedStallId as string | null
      let stallData = null as { id: string } | null
      let stallError = null

      if (stallLookupId) {
        const { data, error } = await supabase.from("stalls").select("id").eq("id", stallLookupId).eq("is_active", true).single()
        stallData = data
        stallError = error
      } 

      if (!stallData) {
        const { data, error } = await supabase
          .from("stalls")
          .select("id")
          .eq("name", name)
          .eq("is_active", true)
          .single()
        stallData = data
        stallError = error
      }

      if (stallError || !stallData) {
        console.error("Error fetching stall:", stallError)
        setMenuItems([])
        return
      }

      // Store the stall ID
      setStallId(stallData.id)
      setCartStallId(stallData.id)

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

  // Filter menu items by search query
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Paginate filtered items
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const getQuantity = (itemId: string) => quantities[itemId] || 1

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
        {/* Stall-level favorite button (top-right) */}
        <View style={styles.bannerActions}>
          <TouchableOpacity
            style={styles.heartBtnBanner}
            onPress={() => {
              if (!stallId) return
              toggleFavorite({ id: stallId, name: String(name), image_url: String(image) })
            }}
          >
            <IconSymbol name={isFavorited(stallId ?? '') ? 'heart.fill' : 'heart'} size={18} color={isFavorited(stallId ?? '') ? '#FF5252' : '#CCCCCC'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Menu List */}
      <View style={{ padding: 18 }}>
        <Text style={styles.menuHeader}>Menu</Text>
        
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#CCC"
          />
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={YELLOW_DARK} />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items available</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items match your search</Text>
          </View>
        ) : (
          <>
            {paginatedItems.map((item) => (
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
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" }}>
                  <Text style={styles.menuPrice}>₱{Number(item.price).toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.actionColumn}>
                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.qtyBtn}
                    onPress={() => {
                      const current = getQuantity(item.id)
                      if (current > 1) {
                        setQuantities({ ...quantities, [item.id]: current - 1 })
                      }
                    }}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{getQuantity(item.id)}</Text>
                  <TouchableOpacity 
                    style={styles.qtyBtn}
                    onPress={() => {
                      const current = getQuantity(item.id)
                      setQuantities({ ...quantities, [item.id]: current + 1 })
                    }}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.addBtn, !item.is_available && styles.addBtnDisabled]} 
                  onPress={() => {
                    if (item.is_available) {
                      // Add item to cart with selected quantity
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        qty: getQuantity(item.id),
                        image_url: item.image_url ?? undefined,
                        image_data: item.image_data ?? undefined,
                        stall_id: stallId ?? undefined,
                      })
                      // Reset quantity for this item
                      setQuantities({ ...quantities, [item.id]: 1 })
                    }
                  }}
                  disabled={!item.is_available}
                >
                  <Text style={styles.addBtnText}>{item.is_available ? "Add" : "Unavailable"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity 
                  style={[styles.paginationBtn, currentPage === 0 && styles.paginationBtnDisabled]}
                  onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <Text style={styles.paginationBtnText}>← Prev</Text>
                </TouchableOpacity>
                
                <Text style={styles.paginationText}>
                  Page {currentPage + 1} of {totalPages}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.paginationBtn, currentPage >= totalPages - 1 && styles.paginationBtnDisabled]}
                  onPress={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  <Text style={styles.paginationBtnText}>Next →</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
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
    marginTop: 8,
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
  actionColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
  bannerActions: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  heartBtnBanner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: YELLOW_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 20,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    paddingVertical: 16,
  },
  paginationBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: YELLOW_DARK,
    borderRadius: 8,
  },
  paginationBtnDisabled: {
    opacity: 0.5,
  },
  paginationBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  paginationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
})
