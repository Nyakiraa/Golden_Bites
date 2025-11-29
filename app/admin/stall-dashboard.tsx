"use client"

import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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

export default function StallDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "summary" | "sales">("home")
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [stallId, setStallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Dummy data for RC FOOD STALL
  const stallData = {
    name: "RC FOOD STALL",
    location: "Bonoan Building, Ateneo de Naga University",
    runningOrders: 10,
    orderRequests: 5,
    rating: 4.9,
    totalReviews: 20,
    popularItems: [
      {
        id: "1",
        name: "Pancakes",
        image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=200&q=80&auto=format&fit=crop",
      },
      {
        id: "2",
        name: "Lumpia",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80&auto=format&fit=crop",
      },
      {
        id: "3",
        name: "Waffles",
        image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200&q=80&auto=format&fit=crop",
      },
    ],
    runningOrdersList: [
      { id: "S3150", name: "Pancake", price: 20.0, image: null },
      { id: "F3420", name: "Waffle", price: 20.0, image: null },
      { id: "F2014", name: "Lumpiang Shanghai", price: 20.0, image: null },
      { id: "F5324", name: "Waffle", price: 20.0, image: null },
      { id: "S8724", name: "Waffle", price: 20.0, image: null },
      { id: "F1234", name: "Pancake", price: 20.0, image: null },
      { id: "S5678", name: "Lumpiang Shanghai", price: 20.0, image: null },
      { id: "F9012", name: "Waffle", price: 20.0, image: null },
      { id: "S3456", name: "Pancake", price: 20.0, image: null },
      { id: "F7890", name: "Lumpiang Shanghai", price: 20.0, image: null },
    ],
  }

  // Fetch stall ID and foods on component mount
  useEffect(() => {
    const fetchStallAndFoods = async () => {
      try {
        setLoading(true)
        
        // First, get the stall ID for RC FOOD STALL
        const { data: stallData, error: stallError } = await supabase
          .from("stalls")
          .select("id")
          .eq("name", "RC FOOD STALL")
          .single()

        if (stallError) {
          console.error("Error fetching stall:", stallError)
          setLoading(false)
          return
        }

        if (stallData) {
          setStallId(stallData.id)

          // Then fetch foods for this stall
          const { data: foodsData, error: foodsError } = await supabase
            .from("foods")
            .select("*")
            .eq("stall_id", stallData.id)
            .eq("is_available", true)
            .order("display_order", { ascending: true, nullsFirst: false })
            .order("name", { ascending: true })

          if (foodsError) {
            console.error("Error fetching foods:", foodsError)
          } else {
            setFoods(foodsData || [])
          }
        }
      } catch (error) {
        console.error("Error in fetchStallAndFoods:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStallAndFoods()
  }, [])

  const handleOrderAction = (orderId: string, action: "done" | "cancel") => {
    // Handle order action (done or cancel)
    console.log(`Order ${orderId}: ${action}`)
    // You can add logic here to update orders, remove from list, etc.
  }

  const renderHomeView = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Status Cards */}
        <View style={styles.orderCardsContainer}>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{stallData.runningOrders}</Text>
            <Text style={styles.orderLabel}>RUNNING ORDERS</Text>
          </View>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{stallData.orderRequests}</Text>
            <Text style={styles.orderLabel}>ORDER REQUEST</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsCard}>
          <View style={styles.reviewsLeft}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All Reviews</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsRight}>
            <MaterialIcons name="star" size={32} color={YELLOW_DARK} />
            <Text style={styles.ratingNumber}>{stallData.rating}</Text>
            <Text style={styles.totalReviewsText}>Total of {stallData.totalReviews} Reviews</Text>
          </View>
        </View>

        {/* Menus Section */}
        <View style={styles.menusCard}>
          <View style={styles.menusHeader}>
            <View style={styles.menusHeaderLeft}>
              <Text style={styles.menusTitle}>Menus</Text>
              <Text style={styles.menusCount}>{foods.length} {foods.length === 1 ? "Item" : "Items"}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>Manage</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={YELLOW_DARK} />
              <Text style={styles.loadingText}>Loading menus...</Text>
            </View>
          ) : foods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="restaurant-menu" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>No menu items yet</Text>
              <Text style={styles.emptySubtext}>Add items to your menu to get started</Text>
            </View>
          ) : (
            <View style={styles.menusList}>
              {foods.map((food) => (
                <View key={food.id} style={styles.menuItem}>
                  {food.image_url ? (
                    <Image
                      source={{ uri: food.image_url }}
                      style={styles.menuItemImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.menuItemImagePlaceholder}>
                      <MaterialIcons name="restaurant" size={24} color="#E0E0E0" />
                    </View>
                  )}
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{food.name}</Text>
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
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Popular Items Section */}
        <View style={styles.popularItemsCard}>
          <View style={styles.popularItemsHeader}>
            <Text style={styles.popularItemsTitle}>Popular Items this Week</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularItemsList}>
            {stallData.popularItems.map((item) => (
              <View key={item.id} style={styles.popularItem}>
                <Image source={{ uri: item.image }} style={styles.popularItemImage} contentFit="cover" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
  )

  const renderOrdersView = () => (
    <View style={styles.ordersContainer}>
      {/* Orders Panel */}
      <View style={styles.ordersPanel}>
        <View style={styles.ordersPanelHandle} />
        <Text style={styles.ordersPanelTitle}>{stallData.runningOrders} Running Orders</Text>
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {stallData.runningOrdersList.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderItemImage}>
                {order.image ? (
                  <Image source={{ uri: order.image }} style={styles.orderImage} contentFit="cover" />
                ) : (
                  <View style={styles.orderImagePlaceholder}>
                    <MaterialIcons name="image" size={24} color="#E0E0E0" />
                  </View>
                )}
              </View>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{order.name}</Text>
                <Text style={styles.orderItemId}>ID: {order.id}</Text>
                <Text style={styles.orderItemPrice}>P {order.price.toFixed(2)}</Text>
              </View>
              <View style={styles.orderItemActions}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => handleOrderAction(order.id, "done")}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleOrderAction(order.id, "cancel")}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header Section */}
      <View style={[styles.header, activeTab === "orders" && styles.headerOrders]}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={[styles.stallName, activeTab === "orders" && styles.stallNameOrders]}>
            {stallData.name}
          </Text>
          {activeTab === "home" && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="#999" />
              <Text style={styles.locationText}>{stallData.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            <Image source={require("@/assets/images/user.png")} style={{ width: 24, height: 24 }} contentFit="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "home" && renderHomeView()}
      {activeTab === "orders" && renderOrdersView()}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
          <View style={[styles.navIcon, activeTab === "home" && styles.navIconActive]}>
            <MaterialIcons name="home" size={24} color={activeTab === "home" ? "#FFFFFF" : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "home" && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("orders")}>
          <View style={[styles.navIcon, activeTab === "orders" && styles.navIconActive]}>
            <MaterialIcons name="list" size={24} color={activeTab === "orders" ? "#FFFFFF" : "#999"} />
            {activeTab !== "orders" && (
              <View style={styles.ordersBadge}>
                <Text style={styles.ordersBadgeText}>{stallData.runningOrders}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, activeTab === "orders" && styles.navLabelActive]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navAddButton}>
          <MaterialIcons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("summary")}>
          <View style={[styles.navIcon, activeTab === "summary" && styles.navIconActive]}>
            <MaterialIcons name="description" size={24} color={activeTab === "summary" ? "#FFFFFF" : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "summary" && styles.navLabelActive]}>Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("sales")}>
          <View style={[styles.navIcon, activeTab === "sales" && styles.navIconActive]}>
            <MaterialIcons name="trending-up" size={24} color={activeTab === "sales" ? "#FFFFFF" : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "sales" && styles.navLabelActive]}>Sales Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const YELLOW_DARK = "#F2BC2B"
const YELLOW_BG = "#FFF9E6"
const CREAM_BG = "#FFFEF5"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM_BG,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerOrders: {
    backgroundColor: YELLOW_BG,
  },
  stallNameOrders: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "700",
  },
  menuButton: {
    padding: 4,
    marginTop: 4,
  },
  headerInfo: {
    flex: 1,
    marginTop: 4,
  },
  stallName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#999",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 100,
  },
  orderCardsContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  orderCard: {
    flex: 1,
    backgroundColor: YELLOW_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderNumber: {
    fontSize: 42,
    fontWeight: "800",
    color: YELLOW_DARK,
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  reviewsCard: {
    backgroundColor: YELLOW_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewsLeft: {
    gap: 8,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: "600",
    color: YELLOW_DARK,
  },
  reviewsRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: YELLOW_DARK,
    marginTop: 4,
  },
  totalReviewsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
  },
  menusCard: {
    backgroundColor: YELLOW_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  menusHeaderLeft: {
    gap: 4,
  },
  menusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  menusCount: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
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
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
  },
  menusList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  menuItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemInfo: {
    flex: 1,
    gap: 6,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  menuItemDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: "#666",
    lineHeight: 18,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
  categoryBadge: {
    backgroundColor: YELLOW_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },
  popularItemsCard: {
    backgroundColor: YELLOW_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  popularItemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  popularItemsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  popularItemsList: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "flex-start",
  },
  popularItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: YELLOW_DARK,
  },
  popularItemImage: {
    width: "100%",
    height: "100%",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    position: "relative",
  },
  navIconActive: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#999",
  },
  navLabelActive: {
    color: YELLOW_DARK,
    fontWeight: "700",
  },
  navAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: YELLOW_DARK,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  ordersBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF5252",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ordersBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  ordersContainer: {
    flex: 1,
    backgroundColor: CREAM_BG,
  },
  ordersPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 100,
    marginTop: 8,
  },
  ordersPanelHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  ordersPanelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  ordersList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    gap: 12,
  },
  orderItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  orderImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  orderImage: {
    width: "100%",
    height: "100%",
  },
  orderItemInfo: {
    flex: 1,
    gap: 4,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  orderItemId: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginTop: 2,
  },
  orderItemActions: {
    gap: 8,
    alignItems: "flex-end",
  },
  doneButton: {
    backgroundColor: YELLOW_DARK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000",
    minWidth: 80,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
})
