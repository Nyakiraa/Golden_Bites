"use client"

import { supabase } from "@/lib/supabase"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Image } from "expo-image"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

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

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  delivery_address: string | null
  created_at: string
  order_items?: OrderItem[]
}

interface OrderItem {
  id: string
  food_id: string
  quantity: number
  price: number
  subtotal: number
  foods?: {
    name: string
    image_url: string | null
  }
}

export default function StallDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "summary" | "sales">("home")
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [stallId, setStallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [stallName, setStallName] = useState("RC FOOD STALL")
  const [stallLocation, setStallLocation] = useState("Bonoan Building, Ateneo de Naga University")
  const [runningOrders, setRunningOrders] = useState(0)
  const [orderRequests, setOrderRequests] = useState(0)
  const [rating, setRating] = useState(4.9)
  const [totalReviews, setTotalReviews] = useState(20)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch stall ID and foods function
  const fetchStallAndFoods = useCallback(async () => {
    try {
      setLoading(true)
      
      // First, get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("Error getting user:", userError)
        setLoading(false)
        return
      }

      // Get the admin record for this user to find their stall_id
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

      // Get the stall details using the stall_id from admin record
      const { data: stallData, error: stallError } = await supabase
        .from("stalls")
        .select("id, name, location")
        .eq("id", adminData.stall_id)
        .single()

      if (stallError) {
        console.error("Error fetching stall:", stallError)
        setLoading(false)
        return
      }

      if (stallData) {
        setStallId(stallData.id)
        setStallName(stallData.name || "RC FOOD STALL")
        setStallLocation(stallData.location || "Bonoan Building, Ateneo de Naga University")

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

        // Fetch orders for this stall
        await fetchOrders(stallData.id)
      }
    } catch (error) {
      console.error("Error in fetchStallAndFoods:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and when screen is focused
  useEffect(() => {
    fetchStallAndFoods()
  }, [fetchStallAndFoods])

  // Refresh when screen comes into focus (e.g., after adding an item)
  useFocusEffect(
    useCallback(() => {
      fetchStallAndFoods()
      if (stallId && activeTab === "orders") {
        fetchOrders(stallId)
      }
    }, [fetchStallAndFoods, stallId, activeTab, fetchOrders])
  )

  // Refresh orders when switching to orders tab
  useEffect(() => {
    if (activeTab === "orders" && stallId) {
      fetchOrders(stallId)
    }
  }, [activeTab, stallId, fetchOrders])

  // Fetch orders for the stall
  const fetchOrders = useCallback(async (stallIdParam: string) => {
    try {
      setOrdersLoading(true)

      // Fetch orders with order items and food details
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          total,
          delivery_address,
          created_at,
          order_items (
            id,
            food_id,
            quantity,
            price,
            subtotal,
            foods (
              name,
              image_url
            )
          )
        `, { count: "exact" })
        .eq("stall_id", stallIdParam)
        .in("status", ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"])
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
        setOrders([])
        setRunningOrders(0)
        setOrderRequests(0)
        return
      }

      console.log("Fetched orders:", ordersData)
      setOrders(ordersData || [])
      
      // Count orders by status
      const pendingCount = (ordersData || []).filter(o => o.status === "pending").length
      const runningCount = (ordersData || []).filter(o => 
        ["confirmed", "preparing", "ready", "completed", "cancelled"].includes(o.status)
      ).length

      setOrderRequests(pendingCount)
      setRunningOrders(runningCount)
    } catch (error) {
      console.error("Error in fetchOrders:", error)
      setOrders([])
      setRunningOrders(0)
      setOrderRequests(0)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowUserMenu(false),
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut()
              if (error) {
                Alert.alert("Error", "Failed to logout. Please try again.")
              } else {
                // Navigation will be handled by _layout.tsx auth state change
                router.replace("/welcome")
              }
            } catch (error: any) {
              console.error("Error in handleLogout:", error)
              Alert.alert("Error", error.message || "An unexpected error occurred")
            } finally {
              setShowUserMenu(false)
            }
          },
        },
      ]
    )
  }

  const handleOrderAction = async (orderId: string, action: "done" | "cancel") => {
    // Show confirmation for cancel action
    if (action === "cancel") {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => performOrderAction(orderId, action),
          },
        ]
      )
      return
    }

    // For done action, proceed directly
    await performOrderAction(orderId, action)
  }

  const performOrderAction = async (orderId: string, action: "done" | "cancel") => {
    try {
      let newStatus: string
      if (action === "done") {
        newStatus = "completed"
      } else {
        newStatus = "cancelled"
      }

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)

      if (error) {
        console.error("Error updating order:", error)
        Alert.alert("Error", "Failed to update order")
        return
      }

      // Refresh orders
      if (stallId) {
        await fetchOrders(stallId)
      }
    } catch (error) {
      console.error("Error in performOrderAction:", error)
      Alert.alert("Error", "An unexpected error occurred")
    }
  }

  const renderHomeView = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Status Cards */}
        <View style={styles.orderCardsContainer}>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{runningOrders}</Text>
            <Text style={styles.orderLabel}>RUNNING ORDERS</Text>
          </View>
          <View style={styles.orderCard}>
            <Text style={styles.orderNumber}>{orderRequests}</Text>
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
            <Text style={styles.ratingNumber}>{rating}</Text>
            <Text style={styles.totalReviewsText}>Total of {totalReviews} Reviews</Text>
          </View>
        </View>

        {/* Menus Section */}
        <View style={styles.menusCard}>
          <View style={styles.menusHeader}>
            <View style={styles.menusHeaderLeft}>
              <Text style={styles.menusTitle}>Menus</Text>
              <Text style={styles.menusCount}>{foods.length} {foods.length === 1 ? "Item" : "Items"}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/admin/manage-menu")}>
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

      </ScrollView>
  )

  const renderOrdersView = () => (
    <View style={styles.ordersContainer}>
      {/* Orders Panel */}
      <View style={styles.ordersPanel}>
        <Text style={styles.ordersPanelTitle}>
          {runningOrders + orderRequests} {runningOrders + orderRequests === 1 ? "Order" : "Orders"}
        </Text>
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {ordersLoading ? (
            <View style={styles.emptyOrdersContainer}>
              <ActivityIndicator size="large" color={YELLOW_DARK} />
              <Text style={styles.emptyOrdersText}>Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyOrdersContainer}>
              <MaterialIcons name="shopping-cart" size={64} color="#E0E0E0" />
              <Text style={styles.emptyOrdersText}>No orders yet</Text>
              <Text style={styles.emptyOrdersSubtext}>Orders from customers will appear here</Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderItem} onPress={() => setSelectedOrder(order)}>
                <View style={styles.orderItemHeader}>
                  <View style={styles.orderItemHeaderLeft}>
                    <Text style={styles.orderItemNumber}>{order.order_number}</Text>
                    <View style={[
                      styles.statusBadge,
                      order.status === "pending" && styles.statusBadgePending,
                      order.status === "completed" && styles.statusBadgeCompleted,
                      order.status === "cancelled" && styles.statusBadgeCancelled,
                    ]}>
                      <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderItemTime}>
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                
                {order.order_items && order.order_items.length > 0 && (
                  <View style={styles.orderItemsList}>
                    {order.order_items.map((item) => (
                      <View key={item.id} style={styles.orderItemRow}>
                        <View style={styles.orderItemImage}>
                          {item.foods?.image_url ? (
                            <Image source={{ uri: item.foods.image_url }} style={styles.orderImage} contentFit="cover" />
                          ) : (
                            <View style={styles.orderImagePlaceholder}>
                              <MaterialIcons name="restaurant" size={24} color="#E0E0E0" />
                            </View>
                          )}
                        </View>
                        <View style={styles.orderItemInfo}>
                          <Text style={styles.orderItemName}>
                            {item.foods?.name || "Unknown Item"}
                          </Text>
                          <Text style={styles.orderItemQty}>Qty: {item.quantity}</Text>
                          <Text style={styles.orderItemPrice}>₱{Number(item.subtotal).toFixed(2)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {order.delivery_address && (
                  <View style={styles.orderAddress}>
                    <MaterialIcons name="location-on" size={16} color="#666" />
                    <Text style={styles.orderAddressText}>{order.delivery_address}</Text>
                  </View>
                )}

                <View style={styles.orderItemFooter}>
                  <Text style={styles.orderTotal}>Total: ₱{Number(order.total).toFixed(2)}</Text>
                  <View style={styles.orderItemActions}>
                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <>
                        <TouchableOpacity
                          style={styles.doneButton}
                          onPress={() => handleOrderAction(order.id, "done")}
                        >
                          <Text style={styles.doneButtonText}>
                            {order.status === "ready" ? "Complete" : "Mark Ready"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleOrderAction(order.id, "cancel")}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  )

  const renderOrderDetailsModal = () => (
    <Modal
      visible={selectedOrder !== null}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedOrder(null)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)}>
            <MaterialIcons name="close" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Order {selectedOrder?.order_number}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {selectedOrder && (
            <>
              {/* Order Status */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Order Status</Text>
                <View style={[
                  styles.statusBadge,
                  selectedOrder.status === "pending" && styles.statusBadgePending,
                  selectedOrder.status === "completed" && styles.statusBadgeCompleted,
                  selectedOrder.status === "cancelled" && styles.statusBadgeCancelled,
                ]}>
                  <Text style={styles.statusText}>{selectedOrder.status.toUpperCase()}</Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Items Ordered</Text>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <View style={styles.modalItemsList}>
                    {selectedOrder.order_items.map((item) => (
                      <View key={item.id} style={styles.modalOrderItem}>
                        <View style={styles.modalItemImage}>
                          {item.foods?.image_url ? (
                            <Image source={{ uri: item.foods.image_url }} style={styles.modalImage} contentFit="cover" />
                          ) : (
                            <View style={styles.modalImagePlaceholder}>
                              <MaterialIcons name="restaurant" size={32} color="#E0E0E0" />
                            </View>
                          )}
                        </View>
                        <View style={styles.modalItemInfo}>
                          <Text style={styles.modalItemName}>{item.foods?.name || "Unknown Item"}</Text>
                          <Text style={styles.modalItemQty}>Quantity: {item.quantity}</Text>
                          <Text style={styles.modalItemPrice}>₱{Number(item.subtotal).toFixed(2)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.modalNoItems}>No items in this order</Text>
                )}
              </View>

              {/* Delivery Address */}
              {selectedOrder.delivery_address && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Delivery Address</Text>
                  <View style={styles.modalAddressBox}>
                    <MaterialIcons name="location-on" size={20} color={YELLOW_DARK} />
                    <Text style={styles.modalAddressText}>{selectedOrder.delivery_address}</Text>
                  </View>
                </View>
              )}

              {/* Total */}
              <View style={styles.modalSection}>
                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>Total Amount:</Text>
                  <Text style={styles.modalTotalAmount}>₱{Number(selectedOrder.total).toFixed(2)}</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.stallName}>
            {stallName}
          </Text>
          {activeTab === "home" && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="#999" />
              <Text style={styles.locationText}>{stallLocation}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.avatarButton}
            onPress={() => setShowUserMenu(true)}
          >
            <Image source={require("@/assets/images/user.png")} style={{ width: 24, height: 24 }} contentFit="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "home" && renderHomeView()}
      {activeTab === "orders" && renderOrdersView()}

      {/* Order Details Modal */}
      {renderOrderDetailsModal()}

      {/* User Menu Modal */}
      <Modal
        visible={showUserMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowUserMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowUserMenu(false)
                router.push("/admin/profile")
              }}
            >
              <MaterialIcons name="person" size={20} color="#F2BC2B" />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="#FF5252" />
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
            {activeTab !== "orders" && runningOrders > 0 && (
              <View style={styles.ordersBadge}>
                <Text style={styles.ordersBadgeText}>{runningOrders}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, activeTab === "orders" && styles.navLabelActive]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navAddButton} onPress={() => router.push('/admin/add-item')}>
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
  emptyOrdersContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyOrdersText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginTop: 16,
  },
  emptyOrdersSubtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  orderItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderItemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  orderItemNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  statusBadge: {
    backgroundColor: YELLOW_DARK,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgePending: {
    backgroundColor: "#FF9800",
  },
  statusBadgeCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusBadgeCancelled: {
    backgroundColor: "#F44336",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  orderItemTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  orderItemsList: {
    gap: 8,
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderItemInfo: {
    flex: 1,
    gap: 4,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  orderAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  orderAddressText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  orderItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 18,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5252",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  modalItemsList: {
    gap: 12,
  },
  modalOrderItem: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  modalItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  modalItemQty: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  modalItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
  modalNoItems: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  modalAddressBox: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  modalAddressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  modalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  modalTotalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
})
