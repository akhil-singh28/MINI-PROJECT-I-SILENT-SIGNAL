import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function History() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) return;

      const user = JSON.parse(userData);

      const res = await fetch(
        `http://192.168.137.1:8000/history/${user.id}`
      );

      const data = await res.json();

      setAlerts(data.alerts);
      setLoading(false);

    } catch (error) {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString() +
      " | " +
      date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alert History</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>
              {formatDate(item.alert_time)}
            </Text>

            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              {item.location}
            </Text>

            <Text style={styles.status}>✔ Sent</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No alerts found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a"
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15
  },

  label: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 6
  },

  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  status: {
    color: "#22c55e",
    marginTop: 10,
    fontWeight: "bold"
  },

  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40
  }
});