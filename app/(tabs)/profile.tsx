"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ProfileScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

        // Try to read from users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('name, phone')
          .eq('id', u.id)
          .maybeSingle()

        if (profile && !profileError) {
          setName(profile.name ?? "")
          setPhone(profile.phone ?? "")
        } else {
          // Fallback to auth metadata
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
      // Update auth user metadata
      const { data: updatedAuth, error: authError } = await supabase.auth.updateUser({ data: { name: name || null, phone: phone || null } })
      if (authError) {
        console.warn('Failed to update auth user metadata', authError)
      }

      // Upsert into users table (RLS should allow update of own profile)
      const { data, error } = await supabase.from('users').upsert({ id: userId, email, name: name || null, phone: phone || null }, { onConflict: 'id' })
      if (error) {
        Alert.alert('Save failed', error.message || 'Could not save profile')
      } else {
        Alert.alert('Saved', 'Your profile has been updated')
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
          <ActivityIndicator color="#F2BC2B" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, { backgroundColor: '#F5F5F5' }]} value={email} editable={false} />

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="09XXXXXXXXX" keyboardType="phone-pad" />

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 18 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18 },
  label: { color: '#666', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E8E8E8', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, fontSize: 16 },
  saveBtn: { marginTop: 20, backgroundColor: '#F2BC2B', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  logoutBtn: { marginTop: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8E8', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#D9534F', fontWeight: '700' },
})
