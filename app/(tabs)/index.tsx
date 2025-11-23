"use client"

import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      {/* Header: address + profile */}
      <View style={styles.header}>
        <View style={styles.addressContainer}>
          <Text style={styles.deliveryTo}>Deliver to</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>ADNU Campus</Text>
            <Text style={styles.chevron}>▾</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.avatar} activeOpacity={0.7} onPress={() => router.replace("/welcome")}>
          <Image source={require("@/assets/images/user.png")} style={{ width: 24, height: 24 }} contentFit="contain" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput placeholder="Search restaurants or food" placeholderTextColor="#BBB" style={styles.searchInput} />
        <Text style={styles.filterIcon}>⚙️</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {["Breakfast", "Lunch", "Dinner", "Snacks"].map((c) => (
            <TouchableOpacity key={c} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular meals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular meals</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
          {POPULAR_MEALS.map((m) => (
            <TouchableOpacity key={m.id} style={styles.popularCard} activeOpacity={0.85}>
              <Image source={{ uri: m.image }} style={styles.popularImage} />
              <View style={styles.popularBody}>
                <Text style={styles.popularName} numberOfLines={1}>
                  {m.name}
                </Text>
                <Text style={styles.popularMeta}>{m.serving}</Text>
                <Text style={styles.popularPrice}>₱{m.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured near you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured near you</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardList}>
          {MOCK_RESTAURANTS.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: "/restaurant", params: r })}
            >
              <Image
                source={LOCAL_IMAGES[r.image] ?? (typeof r.image === "string" && r.image.startsWith("http") ? { uri: r.image } : undefined)}
                style={styles.cardImage}
              />
              {r.tag && (
                <View style={styles.offerTag}>
                  <Text style={styles.offerText}>{r.tag}</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{r.name}</Text>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.rating}>★ {r.rating.toFixed(1)}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>{r.time} min</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>₱{r.fee} fee</Text>
                </View>
                <Text numberOfLines={1} style={styles.cuisines}>
                  {r.cuisines.join(" • ")}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Button for Cart navigation for demo */}
        <TouchableOpacity style={styles.demoCartBtn} onPress={() => router.push("/cart")}>
          <Text style={styles.demoCartBtnText}>Go to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const YELLOW_DARK = "#F2BC2B"

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

const POPULAR_MEALS = [
  {
    id: "pm1",
    name: "Chicken Fillet Rice Bowl",
    serving: "with gravy",
    price: 99,
    image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd30?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pm2",
    name: "Classic Burger Meal",
    serving: "fries + drink",
    price: 149,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pm3",
    name: "Pancit Canton",
    serving: "special",
    price: 89,
    image: "https://images.unsplash.com/photo-1542442828-2872197443a5?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pm4",
    name: "Iced Caramel Latte",
    serving: "medium",
    price: 95,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80&auto=format&fit=crop",
  },
]

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Bam Bam's",
    rating: 4.6,
    time: 25,
    fee: 19,
    cuisines: ["Filipino", "Fast Food"],
    tag: "20% OFF",
    image: "bambam.png",
  },
  {
    id: "2",
    name: "Puting Bahay Eatery",
    rating: 4.8,
    time: 18,
    fee: 15,
    cuisines: ["Home-Cooked", "Filipino"],
    tag: "BUY 1 GET 1",
    image: "puting_bahay.png",
  },
  {
    id: "3",
    name: "RC Food Stall",
    rating: 4.5,
    time: 30,
    fee: 25,
    cuisines: ["Street Food", "Filipino"],
    tag: "",
    image: "RC.png",
  },
  {
    id: "4",
    name: "NOMO House of Sizzlers",
    rating: 4.7,
    time: 16,
    fee: 10,
    cuisines: ["Grill", "Sizzlers"],
    tag: "FREE DRINK",
    image: "NOMO.png",
  },
  {
    id: "5",
    name: "Noodle House",
    rating: 4.8,
    time: 14,
    fee: 12,
    cuisines: ["Asian", "Noodles"],
    tag: "BUY 2 GET 1",
    image: "noodle_house.png",
  },
  {
    id: "6",
    name: "Kuya's Platter",
    rating: 4.4,
    time: 28,
    fee: 20,
    cuisines: ["Filipino", "Plates"],
    tag: "",
    image: "kuya_platter.png",
  },
  {
    id: "7",
    name: "Cocina Grill and Restaurant",
    rating: 4.7,
    time: 26,
    fee: 22,
    cuisines: ["Grill", "International"],
    tag: "10% OFF",
    image: "cocina.png",
  },
  {
    id: "8",
    name: "JBI Food Stop",
    rating: 4.9,
    time: 20,
    fee: 10,
    cuisines: ["Snacks", "Fast Food"],
    tag: "BEST SELLER",
    image: "JBI.png",
  },
  {
    id: "9",
    name: "Kuya Kim Cuisine",
    rating: 4.5,
    time: 22,
    fee: 18,
    cuisines: ["Filipino", "Comfort"],
    tag: "",
    image: "kuyakim.png",
  },
  {
    id: "10",
    name: "Tap Tap",
    rating: 4.6,
    time: 15,
    fee: 8,
    cuisines: ["Street Food", "Snacks"],
    tag: "FREE DELIVERY",
    image: "taptap.png",
  },
  {
    id: "11",
    name: "Flavorful Fiesta",
    rating: 4.8,
    time: 24,
    fee: 20,
    cuisines: ["Fiesta", "Party"],
    tag: "",
    image: "flavorful_fiesta.png",
  },
  {
    id: "12",
    name: "Bite Box",
    rating: 4.4,
    time: 27,
    fee: 18,
    cuisines: ["Meals", "Drinks"],
    tag: "15% OFF",
    image: "bitebox.png",
  },
]

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressContainer: { flexDirection: "column" },
  deliveryTo: { color: "#999", fontSize: 12, fontWeight: "500", letterSpacing: 0.2 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  addressText: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  chevron: { fontSize: 14, color: "#999", marginLeft: 4 },
  avatar: {
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

  searchBar: {
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#1a1a1a" },
  filterIcon: { fontSize: 16, marginLeft: 10 },

  scrollContent: { paddingBottom: 28 },
  categories: { paddingHorizontal: 18, marginVertical: 12 },
  categoryChip: {
    backgroundColor: "#FFF4CC",
    borderColor: YELLOW_DARK,
    borderWidth: 1.2,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 12,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: { color: "#5C4B00", fontWeight: "600", fontSize: 14, letterSpacing: 0.3 },

  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 19, fontWeight: "700", color: "#1a1a1a", letterSpacing: 0.2 },
  sectionLink: { color: "#F2BC2B", fontWeight: "600", fontSize: 14 },

  popularList: { paddingHorizontal: 18, marginBottom: 12 },
  popularCard: {
    width: 160,
    marginRight: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  popularImage: { width: "100%", height: 100 },
  popularBody: { padding: 12, gap: 5 },
  popularName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  popularMeta: { color: "#999", fontSize: 12, fontWeight: "500" },
  popularPrice: { marginTop: 4, fontWeight: "800", color: YELLOW_DARK, fontSize: 15 },

  cardList: { paddingHorizontal: 18, gap: 16 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 160 },
  offerTag: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "#000000E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  offerText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  cardBody: { padding: 14, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  rating: { fontWeight: "700", color: "#1a1a1a", fontSize: 14 },
  dot: { color: "#DDD", fontSize: 12 },
  metaText: { color: "#777", fontSize: 13, fontWeight: "500" },
  cuisines: { color: "#999", fontSize: 13, fontWeight: "500" },

  demoCartBtn: {
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: YELLOW_DARK,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  demoCartBtnText: { fontWeight: "700", textAlign: "center", color: "#fff", fontSize: 16, letterSpacing: 0.5 },
})
