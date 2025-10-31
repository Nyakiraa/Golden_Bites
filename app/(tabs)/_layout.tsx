"use client"

import { Tabs } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { HapticTab } from "@/components/haptic-tab"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const [activeTab, setActiveTab] = useState("home")

  const YELLOW_DARK = "#F2BC2B"
  const YELLOW_LIGHT = "#F8DF86"

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
      </Tabs>

      {/* Custom Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
          <View style={[styles.navIcon, activeTab === "home" && styles.activeNavIcon]}>
            <IconSymbol size={24} name="house.fill" color={activeTab === "home" ? YELLOW_DARK : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "home" && styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("cart")}>
          <View style={[styles.navIcon, activeTab === "cart" && styles.activeNavIcon]}>
            <IconSymbol size={24} name="cart.fill" color={activeTab === "cart" ? YELLOW_DARK : "#999"} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </View>
          <Text style={[styles.navLabel, activeTab === "cart" && styles.activeNavLabel]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("favorites")}>
          <View style={[styles.navIcon, activeTab === "favorites" && styles.activeNavIcon]}>
            <IconSymbol size={24} name="heart.fill" color={activeTab === "favorites" ? YELLOW_DARK : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "favorites" && styles.activeNavLabel]}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderRadius: 12,
  },
  activeNavIcon: {
    backgroundColor: "#FFF4CC",
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  activeNavLabel: {
    color: "#F2BC2B",
    fontWeight: "600",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF5252",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#FF5252",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
})
