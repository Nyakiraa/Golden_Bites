"use client"

import { useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

const CART_ITEMS = [
  {
    id: "fd1",
    name: "Chicken Fillet Rice Bowl",
    price: 99,
    qty: 2,
    image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd30?w=250&q=80&auto=format&fit=crop",
  },
  {
    id: "fd3",
    name: "Iced Caramel Latte",
    price: 95,
    qty: 1,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=250&q=80&auto=format&fit=crop",
  },
]

export default function CartScreen() {
  const router = useRouter()
  const subtotal = CART_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = 25
  const total = subtotal + deliveryFee

  return (
    <View style={styles.bg}>
      <ScrollView
        style={{ flex: 1, marginBottom: 100 }}
        contentContainerStyle={{ padding: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Order</Text>

        {CART_ITEMS.map((item) => (
          <View style={styles.itemCard} key={item.id}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱{item.price}</Text>
            </View>
            <View style={styles.qtyWrap}>
              <TouchableOpacity style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.replace("/checkout")}>
          <Text style={styles.checkoutBtnText}>Go to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
    color: "#1a1a1a",
    letterSpacing: 0.2,
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
})
