"use client"

import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const YELLOW_LIGHT = "#F8DF86"
const YELLOW_DARK = "#F2BC2B"

type RatingStarsProps = { rating: number; onRate: (n: number) => void }
function RatingStars({ rating, onRate }: RatingStarsProps) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onRate(n)}>
          <Text style={[styles.star, n <= rating ? styles.starActive : styles.starInactive]}>★</Text>
        </Pressable>
      ))}
    </View>
  )
}

const QUICK_FEEDBACK = ["Delicious", "On time", "Well-packed", "Value for money", "Polite driver", "Fresh & hot"]

export default function ReviewScreen() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [chips, setChips] = useState<string[]>([])

  const toggleChip = (c: string) => {
    setChips((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const submit = () => {
    router.replace("/")
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Rate your order</Text>
      <RatingStars rating={rating} onRate={setRating} />

      <View style={styles.chipsWrap}>
        {QUICK_FEEDBACK.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, chips.includes(c) && styles.chipSelected]}
            onPress={() => toggleChip(c)}
          >
            <Text style={[styles.chipText, chips.includes(c) && styles.chipTextSelected]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Leave a comment (optional)"
        placeholderTextColor="#BBB"
        style={styles.input}
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.submitBtn, rating === 0 && { opacity: 0.5 }]}
        disabled={rating === 0}
        onPress={submit}
      >
        <Text style={styles.submitBtnText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 60 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  starsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 },
  star: { fontSize: 44, marginHorizontal: 8 },
  starActive: { color: YELLOW_DARK },
  starInactive: { color: "#E8E8E8" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 12, marginBottom: 20 },
  chip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E8E8",
    borderWidth: 1.2,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: { backgroundColor: YELLOW_DARK, borderColor: YELLOW_DARK },
  chipText: { color: "#777", fontWeight: "600", fontSize: 14 },
  chipTextSelected: { color: "#fff" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    color: "#1a1a1a",
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 110,
    fontSize: 15,
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: YELLOW_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 },
})
