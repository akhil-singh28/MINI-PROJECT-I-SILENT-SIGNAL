import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

export default function Tracking() {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [watcher, setWatcher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadTheme();
    }, [])
  );

  useEffect(() => {
    startLiveTracking();

    return () => {
      if (watcher) {
        watcher.remove();
      }
    };
  }, []);

  const loadTheme = async () => {
    const saved =
      await AsyncStorage.getItem("theme");

    if (saved === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  };

  // START LIVE TRACKING
  const startLiveTracking = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied"
        );
        setLoading(false);
        return;
      }

      const current =
        await Location.getCurrentPositionAsync(
          {
            accuracy:
              Location.Accuracy.High
          }
        );
      setLocation(current.coords);
      const place =
        await Location.reverseGeocodeAsync({
          latitude:
            current.coords.latitude,
          longitude:
            current.coords.longitude,
        });
      if (place.length > 0) {
        const p = place[0];
        setAddress(
          `${p.name || ""}, ${
            p.street || ""
          }, ${p.city || ""}, ${
            p.region || ""
          }`
        );
      }
      const subscription =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 2,
          },
          (pos) => {
            setLocation(pos.coords);
          }
        );
      setWatcher(subscription);
      setLoading(false);
    } catch (error) {
      Alert.alert("Tracking Error");
      setLoading(false);
    }
  };
  // OPEN GOOGLE MAP
  const openMap = () => {
    if (!location) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url);
  };
  // SHARE LOCATION
  const shareLocation = async () => {
  if (!location) {
    Alert.alert("Location not found");
    return;
  }
  try {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    const Share = require("react-native").Share;
    await Share.share({
      message: `📍 My Live Location:\n${mapUrl}`,
      title: "Share Live Location"
    });
  } catch (error) {
    Alert.alert("Unable to share location");
  }
};
  const bg = darkMode
    ? "#0f172a"
    : "#f8fafc";
  const cardBg = darkMode
    ? "#1e293b"
    : "#ffffff";
  const text = darkMode
    ? "#fff"
    : "#111827";
  const subText = darkMode
    ? "#94a3b8"
    : "#475569";
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: bg,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: text },
        ]}
      >
        Live GPS Tracking
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: subText },
        ]}
      >
        Real Time Location Updates
      </Text>

      {loading ? (
        <Text
          style={[
            styles.loading,
            { color: text },
          ]}
        >
          Fetching Live Location...
        </Text>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                cardBg,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: subText,
              },
            ]}
          >
            Latitude
          </Text>

          <Text
            style={[
              styles.value,
              { color: text },
            ]}
          >
            {location?.latitude}
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: subText,
              },
            ]}
          >
            Longitude
          </Text>

          <Text
            style={[
              styles.value,
              { color: text },
            ]}
          >
            {location?.longitude}
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: subText,
              },
            ]}
          >
            Address
          </Text>

          <Text
            style={[
              styles.address,
              { color: text },
            ]}
          >
            {address}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={startLiveTracking}
      >
        <Text style={styles.btnText}>
          Refresh Live Location
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapBtn}
        onPress={openMap}
      >
        <Text style={styles.btnText}>
          Open In Google Maps
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shareBtn}
        onPress={shareLocation}
      >
        <Text style={styles.btnText}>
          Share Location Link
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    marginTop: 8,
  },

  loading: {
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
  },

  address: {
    marginTop: 8,
    lineHeight: 22,
  },

  btn: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  mapBtn: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  shareBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});