"use client"

import { useCart } from "@/app/context/CartContext"
import { supabase } from "@/lib/supabase"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

const ADNU_LOCATIONS = [
  "Engineering Building",
  "SHS Building",
  "H.E Building",
  "Xavier Hall",
  "Main Gate",
  "PHELAN",
  "DOLAN",
  "ADRIATICO",
  "SANTOS",
  "Administration Building",
  "Burns",
  "Mardrigal Building",
  "Alingal",
  "Covert Court",
  "Jesuit Residence",
]

const DELIVERY_FEES: Record<string, number> = {
  "Engineering Building": 25,
  "SHS Building": 30,
  "H.E Building": 35,
  "Xavier Hall": 40,
  "Main Gate": 20,
  "PHELAN": 30,
  "DOLAN": 35,
  "ADRIATICO": 40,
  "SANTOS": 45,
  "Administration Building": 25,
  "Burns": 30,
  "Mardrigal Building": 35,
  "Alingal": 40,
  "Covert Court": 35,
  "Jesuit Residence": 45,
}

export default function CheckoutScreen() {
  const router = useRouter()
  const { cartItems, selectedLocation, setSelectedLocation, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = DELIVERY_FEES[selectedLocation] || 25
  const total = subtotal + deliveryFee

  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        Alert.alert("Error", "Your cart is empty. Please add items before checking out.")
        return
      }

      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        Alert.alert("Error", "Please sign in to place an order")
        return
      }

      // Get stall ID from first item or use default
      let stallId = cartItems[0].stall_id
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
          delivery_address: selectedLocation,
          payment_method: paymentMethod,
          special_instructions: specialInstructions || null,
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
        food_id: item.id,
        quantity: item.qty,
        price: item.price,
        subtotal: item.price * item.qty,
      }))

      // Insert order items
      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems)

        if (itemsError) {
          console.error("Error creating order items:", itemsError)
          Alert.alert("Warning", "Order created but items could not be added. Please contact support.")
        }
      }

      // Clear cart
      clearCart()

      // Navigate to confirmation
      router.replace({
        pathname: "/(tabs)/order-confirmation",
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
      <ScrollView style={{ flex: 1, marginBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Delivery Location */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Deliver to</Text>
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setLocationDropdownOpen(!locationDropdownOpen)}
          >
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Text style={styles.dropdownArrow}>{locationDropdownOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          
          {locationDropdownOpen && (
            <View style={styles.locationDropdown}>
              <ScrollView style={styles.locationScroll}>
                {ADNU_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.locationOption,
                      selectedLocation === loc && styles.locationOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedLocation(loc)
                      setLocationDropdownOpen(false)
                    }}
                  >
                    <Text
                      style={[
                        styles.locationOptionText,
                        selectedLocation === loc && styles.locationOptionTextActive,
                      ]}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Order Summary</Text>
          {cartItems.map((item) => (
            <View style={styles.itemRow} key={item.id}>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱{(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "cash" && styles.radioButtonActive,
                ]}
              />
              <Text style={styles.paymentText}>Cash on Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "gcash" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("gcash")}
            >
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "gcash" && styles.radioButtonActive,
                ]}
              />
              <Text style={styles.paymentText}>GCash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Special Instructions</Text>
          <TextInput
            style={styles.instructionInput}
            placeholder="e.g., Extra ketchup, no onions, etc."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
          />
        </View>

        {/* Totals */}
        <View style={styles.sectionBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>₱{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Delivery Fee</Text>
            <Text style={styles.totalsValue}>₱{deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabelBold}>Total</Text>
            <Text style={styles.totalsValueBold}>₱{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerSticky}>
        <TouchableOpacity 
          style={[styles.checkoutBtn, (loading || cartItems.length === 0) && styles.checkoutBtnDisabled]} 
          onPress={handlePlaceOrder}
          disabled={loading || cartItems.length === 0}
        >
          <Text style={styles.checkoutBtnText}>
            {loading ? "Placing Order..." : "Place Order"}
          </Text>
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
  locationSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  locationText: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdownArrow: {
    color: YELLOW_DARK,
    fontSize: 12,
    fontWeight: "bold",
  },
  locationDropdown: {
    marginTop: 8,
    maxHeight: 200,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
  },
  locationScroll: {
    maxHeight: 200,
  },
  locationOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  locationOptionActive: {
    backgroundColor: "#FFF8E8",
  },
  locationOptionText: {
    color: "#555",
    fontSize: 15,
  },
  locationOptionTextActive: {
    color: YELLOW_DARK,
    fontWeight: "600",
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
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    backgroundColor: "#F9F9F9",
  },
  paymentOptionActive: {
    borderColor: YELLOW_DARK,
    backgroundColor: "#FFF8E8",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCC",
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: YELLOW_DARK,
    backgroundColor: YELLOW_DARK,
  },
  paymentText: {
    color: "#1a1a1a",
    fontSize: 15,
    fontWeight: "600",
  },
  instructionInput: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    color: "#1a1a1a",
    fontSize: 14,
    textAlignVertical: "top",
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
