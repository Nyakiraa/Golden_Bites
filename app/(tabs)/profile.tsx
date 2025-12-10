"use client"

import { supabase } from "@/lib/supabase"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const YELLOW_DARK = "#F2BC2B"
const PURPLE = "#6A2FBF"

export default function ProfileScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEdit, setShowEdit] = useState(true)

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        setLoading(true)
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
          console.warn('No user found', userError)
          return
        }

        const u = userData.user
        if (!mounted) return
        setUserId(u.id)
        setEmail(u.email ?? "")

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('name, phone')
          .eq('id', u.id)
          .maybeSingle()

        if (profile && !profileError) {
          setName(profile.name ?? "")
          setPhone(profile.phone ?? "")
        } else {
          setName((u.user_metadata as any)?.name ?? "")
          setPhone((u.user_metadata as any)?.phone ?? "")
        }
      } catch (e) {
        console.warn('Error loading profile', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await supabase.auth.updateUser({ data: { name: name || null, phone: phone || null } })
      const { error } = await supabase.from('users').upsert({ id: userId, email, name: name || null, phone: phone || null }, { onConflict: 'id' })
      if (error) {
        Alert.alert('Save failed', error.message || 'Could not save profile')
      } else {
        Alert.alert('Saved', 'Your profile has been updated')
        setShowEdit(false)
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut()
              if (error) {
                Alert.alert('Error', 'Failed to logout. Please try again.')
              } else {
                router.replace('/welcome')
              }
            } catch (e: any) {
              Alert.alert('Error', e.message || 'An unexpected error occurred')
            }
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={YELLOW_DARK} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Account</Text>

        </View>

        {/* Profile top */}
        <View style={styles.profileTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{name || 'Your Name'}</Text>
            <TouchableOpacity onPress={() => setShowEdit(!showEdit)}>
              <Text style={styles.viewProfileText}>View profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Editable form (moved up so it's visible in profile) */}
        {showEdit && (
          <View style={styles.editBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, { backgroundColor: '#F5F5F5' }]} value={email} editable={false} />

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="09XXXXXXXXX" keyboardType="phone-pad" />

            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveText}>Save</Text>}
            </TouchableOpacity>

          </View>
        )}

        {/* Promo banner */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Welcome Customer!</Text>
          <Text style={styles.promoSub}>Favourites Again?</Text>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/orders')}>
            <MaterialIcons name="receipt-long" size={22} color="#333" />
            <Text style={styles.quickText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/favorites')}>
            <MaterialIcons name="favorite-border" size={22} color="#333" />
            <Text style={styles.quickText}>Favourites</Text>
          </TouchableOpacity>
        </View>



        {/* Perks list */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>About</Text>
          {['Help Center', 'Report', 'Terms And Conditions', 'Invite friends'].map((t) => (
            <TouchableOpacity key={t} style={styles.listItem} onPress={() => { /* placeholder */ }}>
              <Text style={styles.listItemText}>{t}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout visible on main account */}
        <TouchableOpacity style={styles.logoutMainBtn} onPress={handleLogout}>
          <Text style={styles.logoutMainText}>Logout</Text>
        </TouchableOpacity>


      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 18, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerIcon: { padding: 6 },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 12 },
  profileName: { fontSize: 28, fontWeight: '800', color: '#111' },
  viewProfileText: { color: '#666', marginTop: 6 },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, marginLeft: 12 },
  promoCard: { backgroundColor: '#F8DF86', borderRadius: 12, padding: 16, marginVertical: 12 },
  promoTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  promoSub: { color: '#fff', marginTop: 6, opacity: 0.95 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  quickBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginHorizontal: 6, borderWidth: 1, borderColor: '#EFEFEF' },
  quickText: { marginTop: 8, fontWeight: '600' },
  paymentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8' },
  payIcon: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  payLabel: { fontWeight: '700' },
  payBalance: { color: '#777', marginTop: 4 },
  listSection: { marginTop: 18 },
  sectionTitle: { fontWeight: '700', marginBottom: 8, color: '#222' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  listItemText: { color: '#333' },
  editBlock: { marginTop: 18, backgroundColor: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EAEAEA' },
  label: { color: '#666', marginTop: 8, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E8E8E8', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, fontSize: 16 },
  saveBtn: { marginTop: 12, backgroundColor: YELLOW_DARK, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  logoutBtn: { marginTop: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8E8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#D9534F', fontWeight: '700' },
  logoutMainBtn: { marginTop: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8E8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  logoutMainText: { color: '#D9534F', fontWeight: '700' },
})
