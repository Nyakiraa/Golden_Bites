"use client"

import { useCart } from "@/app/context/CartContext"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { supabase } from '@/lib/supabase'
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const router = useRouter()
  const { selectedLocation, setSelectedLocation } = useCart()
  const ADNU_LOCATIONS = [
    'Engineering Building',
    'SHS Bldg.',
    'H.E Building',
    'Xavier Hall',
    'Main Gate',
    'PHELAN',
    'DOLAN',
    'ADRIATICO',
    'SANTOS',
    'ADMINISTRATION BUILDING',
    'BURNS',
    'MARDRIGAL BLDG',
    'ALINGAL',
    'COVERT COURT',
    'JESUIT RESIDENCE',
  ]
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [headerLayout, setHeaderLayout] = useState<{ y: number; height: number } | null>(null)
  const [popularMeals, setPopularMeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchPopular = async () => {
      try {
        // Try to read from public_foods view which returns available foods joined with stall
        const { data, error } = await supabase.from('public_foods').select('*').order('display_order', { ascending: true }).limit(8)
        if (error) {
          console.warn('Failed to fetch popular meals', error)
        }
        if (mounted) {
          setPopularMeals((data ?? []).map((d: any) => ({
            id: d.id,
            name: d.name,
            serving: d.category ?? '',
            price: Number(d.price),
            image: d.image_url,
            stall_name: d.stall_name,
          })))
        }
      } catch (e) {
        console.warn('Error fetching popular meals', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPopular()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchStalls = async () => {
      try {
        setLoadingRestaurants(true)
        // Use public view to avoid auth restrictions while still getting active stalls
        const { data, error } = await supabase
          .from('public_stalls')
          .select('id, name, rating, location')
          .order('name', { ascending: true })
          .limit(50)
        if (error) {
          console.warn('Failed to fetch stalls', error)
          if (mounted) setRestaurants([])
          return
        }

        if (!mounted) return

        const mapped = (data ?? []).map((s: any) => {
          // Map stall names to image keys with proper matching
          const nameLower = (s.name || '').toLowerCase().trim()
          
          // Create a mapping of stall name patterns to image keys
          const stallImageMap: Record<string, string> = {
            'bam-bam': 'bambam.png',
            'bambam': 'bambam.png',
            'kuya kim': 'kuyakim.png',
            'kuyakim': 'kuyakim.png',
            'cocina': 'cocina.png',
            'noodle house': 'noodle_house.png',
            'noodlehouse': 'noodle_house.png',
            'kuya\'s platter': 'kuya_platter.png',
            'kuyas platter': 'kuya_platter.png',
            'kuya platter': 'kuya_platter.png',
            'rc food': 'RC.png',
            'rcfood': 'RC.png',
            'rc': 'RC.png',
            'puting bahay': 'puting_bahay.png',
            'putingbahay': 'puting_bahay.png',
            'nomo': 'NOMO.png',
            'jbi': 'JBI.png',
            'taptap': 'taptap.png',
            'flavorful fiesta': 'flavorful_fiesta.png',
            'flavorfulfiesta': 'flavorful_fiesta.png',
            'bitebox': 'bitebox.png',
          }
          
          // Find matching image key
          let imageKey: string | null = null
          for (const [pattern, key] of Object.entries(stallImageMap)) {
            if (nameLower.includes(pattern)) {
              imageKey = key
              break
            }
          }

          return {
            id: s.id,
            name: s.name,
            rating: Number(s.rating) || 0,
            time: 20,
            fee: 15,
            cuisines: [],
            tag: '',
            image: null,
            imageKey: imageKey,
            location: s.location,
          }
        })

        setRestaurants(mapped)
      } catch (e) {
        console.warn('Error fetching stalls', e)
        if (mounted) setRestaurants([])
      } finally {
        if (mounted) setLoadingRestaurants(false)
      }
    }

    fetchStalls()
    return () => { mounted = false }
  }, [])
  const filteredRestaurants = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase()
    return r.name.toLowerCase().includes(q) || (r.location ?? "").toLowerCase().includes(q)
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Header: address + profile */}
      <View style={styles.header} onLayout={(e) => setHeaderLayout({ y: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height })}>
        <View style={styles.addressContainer}>
          <Text style={styles.deliveryTo}>Deliver to</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setLocationDropdownOpen(!locationDropdownOpen)}
            style={styles.addressRowTouchable}
          >
            <Text style={styles.addressText}>{selectedLocation}</Text>
            <Text style={[styles.chevron, locationDropdownOpen && { transform: [{ rotate: '180deg' }] }]}>▾</Text>
          </TouchableOpacity>

        </View>
      </View>

      {locationDropdownOpen && (
        <TouchableOpacity activeOpacity={1} style={[styles.dropdownOverlay, { top: headerLayout ? headerLayout.y + headerLayout.height : 70 }]} onPress={() => setLocationDropdownOpen(false)}>
          <View style={styles.locationDropdownAbsolute}>
            <ScrollView style={styles.locationScroll} contentContainerStyle={{ paddingVertical: 4 }}>
              {ADNU_LOCATIONS.map((loc, idx) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.locationItem, idx === ADNU_LOCATIONS.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => {
                    setSelectedLocation(loc)
                    setLocationDropdownOpen(false)
                  }}
                >
                  <Text style={styles.locationText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}
      

      {/* Search */}
      <View style={styles.searchBar}>
        <IconSymbol name="magnifyingglass" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search restaurants or food"
          placeholderTextColor="#BBB"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
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
        {loading ? (
          <View style={{ paddingHorizontal: 18, paddingVertical: 8 }}>
            <ActivityIndicator color={YELLOW_DARK} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
            {popularMeals.length === 0 ? (
              <View style={{ paddingHorizontal: 18, paddingVertical: 8 }}>
                <Text style={{ color: "#777", fontWeight: "600" }}>No popular items</Text>
              </View>
            ) : (
              popularMeals.map((m) => (
                <TouchableOpacity key={m.id} style={styles.popularCard} activeOpacity={0.85}>
                  {m.image && typeof m.image === 'string' && m.image.trim() !== '' ? (
                    <Image source={{ uri: m.image }} style={styles.popularImage} />
                  ) : (
                    <View style={[styles.popularImage, { backgroundColor: YELLOW_LIGHT, justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#999', fontSize: 12 }}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.popularBody}>
                    <Text style={styles.popularName} numberOfLines={1}>
                      {m.name}
                    </Text>
                    <Text style={styles.popularMeta}>{m.serving}</Text>
                    <Text style={styles.popularPrice}>₱{m.price}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* Featured near you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Stalls</Text>
        </View>

        <View style={styles.cardList}>
          {loadingRestaurants ? (
            <View style={{ paddingHorizontal: 18 }}>
              <ActivityIndicator color={YELLOW_DARK} />
            </View>
          ) : (
            filteredRestaurants.length === 0 ? (
              <View style={{ paddingHorizontal: 18, paddingVertical: 10 }}>
                <Text style={{ color: "#777", fontWeight: "600" }}>No stalls found</Text>
              </View>
            ) : (
              filteredRestaurants.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push({ 
                    pathname: "/restaurant", 
                    params: { ...r, image: r.imageKey || r.image || "RC.png" }
                  })}
                >
                  <Image
                    source={
                      (typeof r.image === "string" && r.image.startsWith("http"))
                        ? { uri: r.image }
                        : r.imageKey && LOCAL_IMAGES[r.imageKey]
                          ? LOCAL_IMAGES[r.imageKey]
                          : LOCAL_IMAGES["RC.png"]
                    }
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
              ))
            )
          )}
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
const YELLOW_LIGHT = "#F8DF86"

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

  addressRowTouchable: { flexDirection: 'row', alignItems: 'center' },
  locationDropdown: { marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', overflow: 'hidden' },
  locationItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  locationText: { color: '#333' },
  dropdownOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  locationDropdownAbsolute: {
    marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  locationScroll: {
    maxHeight: 260,
  },

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
