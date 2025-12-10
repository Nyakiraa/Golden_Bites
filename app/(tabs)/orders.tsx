"use client"

import { supabase } from "@/lib/supabase"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"

const YELLOW_DARK = "#F2BC2B"
const YELLOW_LIGHT = "#F8DF86"

type OrderItem = {
  id: string
  quantity: number
  subtotal: number
  foods: {
    name: string
    image_url: string | null
  } | null
}

type Order = {
  id: string
  order_number: string
  status: string
  total: number
  subtotal: number
  delivery_fee: number
  created_at: string
  order_items: OrderItem[]
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setOrders([])
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          total,
          subtotal,
          delivery_fee,
          created_at,
          order_items (
            id,
            quantity,
            subtotal,
            foods (
              name,
              image_url
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading orders", error)
        setOrders([])
        return
      }

      setOrders((data as Order[]) || [])
    } catch (err) {
      console.error("Unexpected error loading orders", err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [loadOrders])
  )

  const formatDate = (iso?: string) => {
    if (!iso) return ""
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const statusStyles: Record<string, { bg: string; text: string }> = {
    pending: { bg: "#FFF4CC", text: "#B38300" },
    confirmed: { bg: "#E7F6EC", text: "#2E7D32" },
    preparing: { bg: "#E7F6EC", text: "#2E7D32" },
    ready: { bg: "#E7F0FF", text: "#1B5E20" },
    completed: { bg: "#E7F6EC", text: "#2E7D32" },
    cancelled: { bg: "#FFE7E7", text: "#C62828" },
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 18, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Orders</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={YELLOW_DARK} />
            <Text style={styles.muted}>Loading your orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your past orders will appear here once you place one.</Text>
          </View>
        ) : (
          orders.map((order) => {
            const status = statusStyles[order.status] ?? { bg: "#F2F2F2", text: "#555" }
            const itemsSummary = (order.order_items || [])
              .map((i) => `${i.quantity}x ${i.foods?.name ?? "Item"}`)
              .join(" • ")

            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderNumber}>{order.order_number}</Text>
                  <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.text }]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                <Text style={styles.itemsText} numberOfLines={2}>{itemsSummary}</Text>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₱{Number(order.total).toFixed(2)}</Text>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 18,
    textAlign: "center",
  },
  centered: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 10,
  },
  muted: {
    color: "#666",
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },
  itemsText: {
    fontSize: 14,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 16,
    color: YELLOW_DARK,
    fontWeight: "800",
  },
})

