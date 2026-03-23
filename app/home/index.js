import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { requestPermission } from "./notification";

// ✅ GLOBAL HANDLER (ONLY ONCE)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Index = () => {
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const flatListRef = useRef(null);

  const getWeekDates = useCallback(() => {
    const today = new Date();
    const day = (today.getDay() + 6) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() - day);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  const dates = getWeekDates();

  const formatDayShort = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });

  const formatDate = (date) => date.getDate();

  const isSameDate = (d1, d2) =>
    d1.toDateString() === d2.toDateString();

  const currentDay = formatDayShort(selectedDate);

  const todayIndex = dates.findIndex((date) =>
    isSameDate(date, new Date())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && todayIndex !== -1) {
        flatListRef.current.scrollToIndex({
          index: todayIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [todayIndex]);

  useEffect(() => {
    requestPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [])
  );

  const calculateStreak = useCallback((completed = {}) => {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const day = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (completed[day]) streak++;
      else break;
    }
    return streak;
  }, []);

  const scheduleSmartNotification = async (habit) => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (habit?.completed?.[today]) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Streak at Risk!",
        body: `Don't forget "${habit.title}"`,
      },
      trigger: { seconds: 10 },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Complete ${habit.title}`,
        body: "Stay consistent 💪",
      },
      trigger: { hour: 20, minute: 0, repeats: true },
    });
  };

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:3000/habitslist"
      );

      setHabits(response.data);

      await Notifications.cancelAllScheduledNotificationsAsync();

      for (let habit of response.data) {
        await scheduleSmartNotification(habit);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLongPress = useCallback((habitId) => {
    const selected = habits.find((h) => h._id === habitId);
    setSelectedHabit(selected);
    setModalVisible(true);
  }, [habits]);

  const handleCompletion = async () => {
    const habitId = selectedHabit?._id;

    const updatedCompletion = {
      ...selectedHabit?.completed,
      [currentDay]: true,
    };

    await axios.put(
      `http://10.0.2.2:3000/habits/${habitId}/completed`,
      { completed: updatedCompletion }
    );

    fetchHabits();
    setModalVisible(false);
  };

  const deleteHabit = async () => {
    const habitId = selectedHabit?._id;

    await axios.delete(
      `http://10.0.2.2:3000/habits/${habitId}`
    );

    fetchHabits();
    setModalVisible(false);
  };

  const filteredHabits = habits.filter(
    (habit) =>
      !habit.completed || !habit.completed[currentDay]
  );

  const renderItem = ({ item }) => {
    const isSelected = isSameDate(item, selectedDate);

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        style={[
          styles.dateCard,
          isSelected && styles.selectedDateCard,
        ]}
      >
        <Text style={styles.dayText}>
          {formatDayShort(item).charAt(0)}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>Your Habits</Text>
          </View>

          <Pressable
            style={styles.addBtn}
            onPress={() => router.push("/home/create")}
          >
            <AntDesign name="plus" size={20} color="white" />
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          data={dates}
          horizontal
          keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />

        {filteredHabits.length > 0 ? (
          filteredHabits.map((item) => {
            const streak = calculateStreak(item.completed);

            return (
              <Pressable
                key={item._id}
                onLongPress={() =>
                  handleLongPress(item._id)
                }
                style={styles.habitCard}
              >
                <View
                  style={[
                    styles.colorBar,
                    { backgroundColor: item.color || "#6C63FF" },
                  ]}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.habitTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.subText}>
                    🔥 {streak} day streak
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Start building habits 🚀
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={isModalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Pressable onPress={handleCompletion}>
              <Text style={styles.modalText}>Mark as Completed</Text>
            </Pressable>

            <Pressable onPress={deleteHabit}>
              <Text style={styles.modalDelete}>Delete Habit</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    color: "#6B7280",
    fontSize: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  addBtn: {
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 50,
    elevation: 4,
  },

  dateCard: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  selectedDateCard: {
    backgroundColor: "#6366F1",
  },

  dayText: {
    fontSize: 12,
    color: "#374151",
  },

  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 3,
  },

  colorBar: {
    width: 6,
    height: "100%",
    borderRadius: 10,
    marginRight: 12,
  },

  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  subText: {
    fontSize: 13,
    color: "#6B7280",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 150,
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalBox: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalText: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#111827",
  },

  modalDelete: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#EF4444",
  },

  modalClose: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#6B7280",
  },
});