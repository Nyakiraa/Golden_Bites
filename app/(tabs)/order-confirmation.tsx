"use client"

import { useCart } from "@/app/context/CartContext"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"


const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

export default function OrderConfirmationScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { selectedLocation } = useCart()
  
  const orderNumber = Array.isArray(params.orderNumber) 
    ? params.orderNumber[0] 
    : (params.orderNumber ?? "ORD-000000")

  return (
    <View style={styles.screen}>
      <Image
        source={require("@/assets/images/gb_logo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      <Text style={styles.title}>Thank you for your order!</Text>
      <Text style={styles.subtitle}>Your food is on its way.</Text>
      <Text style={styles.orderNumber}>Order #{orderNumber}</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Delivery Details</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Deliver to:</Text>
          <Text style={styles.rowValue}>{selectedLocation || "ADNU Campus"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimated time:</Text>
          <Text style={styles.rowValue}>20-30 minutes</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status:</Text>
          <Text style={[styles.rowValue, styles.statusPending]}>Pending Confirmation</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.homeBtn} 
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.homeBtn, styles.reviewBtn]} 
        onPress={() => router.push("/(tabs)/review")}
      >
        <Text style={styles.reviewBtnText}>Leave a Review</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  confirmIconWrap: {
    backgroundColor: YELLOW_DARK,
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: { width: 70, height: 70 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1a1a1a", marginBottom: 8, letterSpacing: 0.2 },
  subtitle: { fontSize: 16, color: "#777", marginBottom: 4, fontWeight: "500" },
  orderNumber: { fontSize: 14, color: YELLOW_DARK, fontWeight: "700", marginBottom: 16, letterSpacing: 0.5 },
  summaryBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryTitle: {
    color: YELLOW_DARK,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  totalRow: { paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E8E8E8", marginTop: 8 },
  rowLabel: { color: "#999", fontSize: 14, fontWeight: "600", minWidth: 50 },
  rowValue: { color: "#555", fontSize: 15, fontWeight: "500" },
  statusPending: { color: YELLOW_DARK, fontWeight: "700" },
  totalValue: { color: YELLOW_DARK, fontWeight: "bold", fontSize: 16 },
  homeBtn: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  homeBtnText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },
  reviewBtn: { backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#E8E8E8" },
  reviewBtnText: { color: "#1a1a1a", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },
})
