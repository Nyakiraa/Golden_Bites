"use client"

import { useCart } from '@/app/context/CartContext'
import { Tabs, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HapticTab } from "@/components/haptic-tab"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const [activeTab, setActiveTab] = useState("home")
  // no image/avatar state — we always show the profile icon
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { cartItems } = useCart()

  // Sync active tab based on route pathname when the layout mounts
  useEffect(() => {
    const pathname = router.asPath ?? ''
    if (pathname.includes('/cart')) setActiveTab('cart')
    else if (pathname.includes('/profile')) setActiveTab('profile')
    else if (pathname.includes('/favorites')) setActiveTab('favorites')
    else setActiveTab('home')
  }, [router.asPath])

  // no user load effect — icon only

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
      <View style={[styles.bottomNav, { paddingBottom: 14 + insets.bottom, backgroundColor: '#FFFFFF', borderTopWidth: 0 }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("home")
            router.push('/(tabs)')
          }}
        >
          <View style={[styles.navIcon, activeTab === "home" && styles.activeNavIcon]}>
            <IconSymbol size={24} name="house.fill" color={activeTab === "home" ? YELLOW_DARK : "#999"} />
          </View>
          <Text style={[styles.navLabel, activeTab === "home" && styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("cart")
            router.push('/(tabs)/cart')
          }}
        >
          <View style={[styles.navIcon, activeTab === "cart" && styles.activeNavIcon]}>
            <IconSymbol size={24} name="cart.fill" color={activeTab === "cart" ? YELLOW_DARK : "#999"} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{String(cartItems.length ?? 0)}</Text>
            </View>
          </View>
          <Text style={[styles.navLabel, activeTab === "cart" && styles.activeNavLabel]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("profile")
            router.push('/(tabs)/profile')
          }}
        >
          <View style={[styles.navIcon, activeTab === "profile" && styles.activeNavIcon]}>
            <IconSymbol size={20} name="person.fill" color={activeTab === "profile" ? YELLOW_DARK : '#999'} />
          </View>
          <Text style={[styles.navLabel, activeTab === "profile" && styles.activeNavLabel]}>Account</Text>
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
  profileAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  profileInitialsWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
