"use client"

import { useCart } from "@/app/context/CartContext"
import { useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

export default function CartScreen() {
  const router = useRouter()
  const { cartItems, updateQuantity, removeFromCart } = useCart()

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = 25
  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return
    }
    router.push("/(tabs)/checkout")
  }

  return (
    <View style={styles.bg}>
      <ScrollView
        style={{ flex: 1, marginBottom: 100 }}
        contentContainerStyle={{ padding: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Cart</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>Add items from the restaurant menu to get started</Text>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View style={styles.itemCard} key={item.id}>
              <Image 
                source={{ uri: item.image_data || item.image_url }} 
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₱{Number(item.price).toFixed(2)}</Text>
              </View>
              <View style={styles.qtyWrap}>
                <TouchableOpacity 
                  style={styles.qtyBtn}
                  onPress={() => handleDecreaseQty(item.id)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{item.qty}</Text>
                <TouchableOpacity 
                  style={styles.qtyBtn}
                  onPress={() => handleIncreaseQty(item.id)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₱{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₱{deliveryFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>₱{total}</Text>
          </View>
        </View>
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.checkoutBtn, cartItems.length === 0 && styles.checkoutBtnDisabled]} 
            onPress={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutBtnText}>Go to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 22,
    marginTop: 24,
    marginBottom: 18,
    color: "#1a1a1a",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: YELLOW_LIGHT,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: YELLOW_DARK,
    fontWeight: "700",
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 90,
    justifyContent: "space-between",
    marginLeft: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: YELLOW_DARK,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  qtyNum: {
    width: 26,
    textAlign: "center",
    fontWeight: "800",
    color: "#1a1a1a",
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#777",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: "#777",
    fontWeight: "500",
  },
  summaryLabelBold: {
    fontWeight: "700",
    fontSize: 17,
    color: "#1a1a1a",
  },
  summaryValueBold: {
    fontWeight: "700",
    fontSize: 17,
    color: YELLOW_DARK,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E8E8E8",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  checkoutBtn: {
    backgroundColor: YELLOW_DARK,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  checkoutBtnDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    paddingVertical: 60,
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
  browseBtn: {
    backgroundColor: YELLOW_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5252",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  removeBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
