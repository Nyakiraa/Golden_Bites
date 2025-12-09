"use client"

import { useCart } from "@/app/context/CartContext"
import { supabase } from "@/lib/supabase"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

export default function CheckoutScreen() {
  const router = useRouter()
  const { cartItems } = useCart()
  const [loading, setLoading] = useState(false)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = 25
  const total = subtotal + deliveryFee

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        Alert.alert("Error", "Please sign in to place an order")
        return
      }

      // TODO: Get stall_id from cart context or route params
      // For now, we'll try to find RC FOOD STALL as a default
      let stallId = STALL_ID
      if (!stallId) {
        const { data: stallData } = await supabase
          .from("stalls")
          .select("id")
          .eq("name", "RC FOOD STALL")
          .eq("is_active", true)
          .single()
        
        if (!stallData) {
          Alert.alert("Error", "Stall not found. Please try again.")
          return
        }
        stallId = stallData.id
      }

      // Check if cart is empty
      if (cartItems.length === 0) {
        Alert.alert("Error", "Your cart is empty. Please add items before checking out.")
        return
      }

      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          stall_id: stallId,
          order_number: orderNumber,
          status: "pending",
          delivery_address: "ADNU Campus, Naga City",
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total: total,
        })
        .select()
        .single()

      if (orderError || !orderData) {
        console.error("Error creating order:", orderError)
        Alert.alert("Error", "Failed to create order. Please try again.")
        return
      }

      // Create order items from cart items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        food_id: item.id, // Use the item id as food_id
        quantity: item.qty,
        price: item.price,
        subtotal: item.price * item.qty,
      }))

      // Insert order items
      if (orderItems.length > 0) {
        console.log("Inserting order items:", orderItems)
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)

        if (itemsError) {
          console.error("Error creating order items:", itemsError)
          Alert.alert("Warning", "Order created but items could not be added. Please contact support.")
          // Continue anyway - order is created
        } else {
          console.log("Order items created successfully")
        }
      }

      // Navigate to confirmation
      router.replace({
        pathname: "/order-confirmation",
        params: { orderNumber: orderNumber }
      })
    } catch (error: any) {
      console.error("Error in handlePlaceOrder:", error)
      Alert.alert("Error", error.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Checkout</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Deliver to</Text>
          <Text style={styles.sectionAddress}>ADNU Campus, Naga City</Text>
        </View>
        {/* Order Summary */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Order Summary</Text>
          {cartItems.map((item) => (
            <View style={styles.itemRow} key={item.id}>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱{item.price * item.qty}</Text>
            </View>
          ))}
        </View>
        {/* Totals */}
        <View style={styles.sectionBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>₱{subtotal}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Delivery</Text>
            <Text style={styles.totalsValue}>₱{deliveryFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabelBold}>Total</Text>
            <Text style={styles.totalsValueBold}>₱{total}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerSticky}>
        <TouchableOpacity 
          style={[styles.checkoutBtn, loading && styles.checkoutBtnDisabled]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.checkoutBtnText}>{loading ? "Placing Order..." : "Place Order"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: 50,
    paddingBottom: 18,
    backgroundColor: YELLOW_DARK,
    alignItems: "center",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  sectionBlock: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionLabel: {
    color: YELLOW_DARK,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  sectionAddress: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  itemQty: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 15,
    width: 28,
  },
  itemName: {
    flex: 1,
    color: "#555",
    fontSize: 15,
    fontWeight: "500",
  },
  itemPrice: {
    color: YELLOW_DARK,
    fontSize: 15,
    fontWeight: "700",
    minWidth: 70,
    textAlign: "right",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 8,
  },
  totalsLabel: { color: "#777", fontSize: 15, fontWeight: "500" },
  totalsValue: { color: "#777", fontSize: 15, fontWeight: "500" },
  totalsLabelBold: { color: "#1a1a1a", fontWeight: "bold", fontSize: 17 },
  totalsValueBold: { color: YELLOW_DARK, fontWeight: "bold", fontSize: 17 },
  footerSticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  checkoutBtn: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  checkoutBtnDisabled: {
    opacity: 0.6,
  },
})
