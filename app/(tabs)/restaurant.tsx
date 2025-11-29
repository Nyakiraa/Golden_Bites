"use client"

import { useLocalSearchParams, useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

const DEMO_MENU = [
  {
    id: "fd1",
    name: "Chicken Fillet Rice Bowl",
    desc: "Tender chicken fillet with savory gravy over rice.",
    price: 99,
    image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd30?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: "fd2",
    name: "Classic Burger Meal",
    desc: "Juicy beef patty, fries, and a drink.",
    price: 149,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: "fd3",
    name: "Iced Caramel Latte",
    desc: "Sweet, cold coffee with caramel drizzle.",
    price: 95,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&q=80&auto=format&fit=crop",
  },
]

export default function RestaurantScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const name = Array.isArray(params.name) ? params.name[0] : (params.name ?? "")
  const image = Array.isArray(params.image) ? params.image[0] : (params.image ?? "")
  const tag = Array.isArray(params.tag) ? params.tag[0] : (params.tag ?? "")
  const rating = Array.isArray(params.rating) ? params.rating[0] : (params.rating ?? "")
  const fee = Array.isArray(params.fee) ? params.fee[0] : (params.fee ?? "")
  const time = Array.isArray(params.time) ? params.time[0] : (params.time ?? "")
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
        {DEMO_MENU.map((item) => (
          <View style={styles.menuCard} key={item.id}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.menuPrice}>₱{item.price}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/cart")}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
})
