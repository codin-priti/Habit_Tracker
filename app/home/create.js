import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";

const Create = () => {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState("");
  const [title, setTitle] = useState("");
  const [repeatMode, setRepeatMode] = useState("daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminder, setReminder] = useState(true);
  const [mood, setMood] = useState(null);

  const moodSuggestions = {
    happy: ["Go for a walk", "Call a friend", "Write gratitude"],
    sad: ["Meditate 5 min", "Listen to music", "Journal thoughts"],
    tired: ["Drink water", "Take power nap", "Stretch body"],
    angry: ["Deep breathing", "Workout", "Take a break"],
    neutral: ["Read a book", "Clean desk", "Plan day"],
  };

  const colors = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const moods = [
    { key: "happy", emoji: "😊" },
    { key: "neutral", emoji: "😐" },
    { key: "sad", emoji: "😔" },
    { key: "angry", emoji: "😡" },
    { key: "tired", emoji: "😴" },
  ];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  async function addHabit() {
    if (!title.trim()) return Alert.alert("Error", "Enter habit title");
    if (!selectedColor) return Alert.alert("Error", "Select color");

    try {
      const habitDetails = {
        title,
        color: selectedColor,
        repeatMode,
        days: repeatMode === "weekly" ? selectedDays : [],
        reminder,
        mood,
        completed: {},
      };

      const response = await axios.post(
        "http://10.0.2.2:3000/habits",
        habitDetails
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Habit added!");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add habit");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.title}>Create Habit</Text>
      </View>

      <Text style={styles.label}>Your Mood</Text>
      <View style={styles.row}>
        {moods.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setMood(item.key)}
            style={[
              styles.moodBox,
              mood === item.key && styles.activeMood,
            ]}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mood && (
        <>
          <Text style={styles.label}>Suggestions</Text>
          <View style={styles.row}>
            {moodSuggestions[mood].map((item, index) => (
              <Pressable
                key={index}
                style={styles.suggestion}
                onPress={() => setTitle(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Habit Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="e.g. Drink Water"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Choose Color</Text>
      <View style={styles.row}>
        {colors.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedColor(item)}>
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                selectedColor === item && styles.selectedColor,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Repeat</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setRepeatMode("daily")}
          style={[
            styles.repeatBtn,
            repeatMode === "daily" && styles.activeBtn,
          ]}
        >
          <Text
            style={[
              styles.repeatText,
              repeatMode === "daily" && styles.activeText,
            ]}
          >
            Daily
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRepeatMode("weekly")}
          style={[
            styles.repeatBtn,
            repeatMode === "weekly" && styles.activeBtn,
          ]}
        >
          <Text
            style={[
              styles.repeatText,
              repeatMode === "weekly" && styles.activeText,
            ]}
          >
            Weekly
          </Text>
        </Pressable>
      </View>

      {repeatMode === "weekly" && (
        <View style={styles.row}>
          {days.map((item) => (
            <Pressable
              key={item}
              onPress={() => toggleDay(item)}
              style={[
                styles.dayBox,
                selectedDays.includes(item) && styles.selectedDay,
              ]}
            >
              <Text
                style={
                  selectedDays.includes(item)
                    ? styles.dayTextActive
                    : styles.dayText
                }
              >
                {item[0]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.reminderRow}>
        <Text style={styles.label}>Reminder</Text>
        <Pressable onPress={() => setReminder(!reminder)}>
          <Text style={styles.reminderToggle}>
            {reminder ? "ON" : "OFF"}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveBtn} onPress={addHabit}>
        <Text style={styles.saveText}>Save Habit</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  moodBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },

  activeMood: {
    backgroundColor: "#6366F1",
  },

  emoji: {
    fontSize: 22,
  },

  suggestion: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  suggestionText: {
    color: "#3730A3",
    fontSize: 13,
  },

  input: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },

  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: "#111827",
  },

  repeatBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  activeBtn: {
    backgroundColor: "#6366F1",
  },

  repeatText: {
    color: "#374151",
    fontWeight: "500",
  },

  activeText: {
    color: "#FFFFFF",
  },

  dayBox: {
    width: 42,
    height: 42,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  selectedDay: {
    backgroundColor: "#6366F1",
  },

  dayText: {
    color: "#374151",
  },

  dayTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  reminderToggle: {
    color: "#6366F1",
    fontWeight: "600",
  },

  saveBtn: {
    marginTop: 30,
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});