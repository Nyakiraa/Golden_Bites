"use client"

import { useCart } from "@/app/context/CartContext"
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

export default function FavoritesScreen() {
  const router = useRouter()
  const { favorites, toggleFavorite } = useCart()

  const openStall = (stall: any) => {
    // Navigate to the restaurant/stall page — pass name and image so the page can render
    router.push({ pathname: '/(tabs)/restaurant', params: { name: stall.name, image: stall.image_url } })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="heart" size={64} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtext}>
            Add your favorite meals to quickly order them again
          </Text>
          <TouchableOpacity 
            style={styles.browseBtn}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.browseBtnText}>Browse Meals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {favorites.map((stall) => (
            <View style={styles.favoriteCard} key={stall.id}>
              {stall.image_url ? (
                <Image 
                  source={{ uri: stall.image_url }}
                  style={styles.favoriteImage}
                />
              ) : (
                <View style={[styles.favoriteImage, { backgroundColor: YELLOW_LIGHT, justifyContent: "center", alignItems: "center" }] }>
                  <Text style={{ color: "#999" }}>No Image</Text>
                </View>
              )}

              <View style={styles.favoriteDetails}>
                <View style={styles.stallNameRow}>
                  <Text style={styles.favoriteName}>{stall.name}</Text>
                  <TouchableOpacity 
                    style={styles.heartBtnInline}
                    onPress={() => toggleFavorite(stall)}
                  >
                    <IconSymbol name="heart.fill" size={16} color={'#FF5252'} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.favoriteActions}>
                <TouchableOpacity 
                  style={styles.addBtn}
                  onPress={() => openStall(stall)}
                >
                  <Text style={styles.addBtnText}>Open Stall</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 8,
    color: "#1a1a1a",
  },
  emptySubtext: { 
    color: "#666", 
    textAlign: "center", 
    marginBottom: 24,
    fontSize: 15,
  },
  browseBtn: { 
    backgroundColor: YELLOW_DARK, 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 12,
  },
  browseBtnText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 15,
  },
  listContainer: {
    padding: 18,
    paddingBottom: 24,
  },
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  favoriteImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: YELLOW_LIGHT,
  },
  favoriteDetails: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  favoritePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: YELLOW_DARK,
  },
  stallNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  heartBtnInline: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  heartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  heartText: {
    fontSize: 18,
  },
  addBtn: {
    backgroundColor: YELLOW_DARK,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
})
