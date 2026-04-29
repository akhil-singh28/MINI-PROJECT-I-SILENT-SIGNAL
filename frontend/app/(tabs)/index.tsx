import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Linking,
  Alert,
  Modal,
  Platform,
  Switch
} from "react-native";
import { Audio } from "expo-av";
import * as Camera from "expo-camera";
import call from "react-native-phone-call";
import * as SMS from "expo-sms";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [siren, setSiren] = useState<any>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [sent, setSent] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [alertHistory, setAlertHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    loadHistory();
    loadTheme();
  }, []);

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem("alertHistory");
    if (saved) setAlertHistory(JSON.parse(saved));
  };

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");
    if (saved !== null) {
      setDarkMode(saved === "dark");
    }
  };

  const toggleTheme = async () => {
    const value = !darkMode;
    setDarkMode(value);
    await AsyncStorage.setItem(
      "theme",
      value ? "dark" : "light"
    );
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const makeCall = async (number: string) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch {
      Alert.alert("Unable to make call");
    }
  };

  const openSMS = async (
    phone: string,
    message: string
  ) => {
    try {
      let url = "";
      if (Platform.OS === "android") {
        url = `sms:${phone}?body=${encodeURIComponent(
          message
        )}`;
      } else {
        url = `sms:${phone}&body=${encodeURIComponent(
          message
        )}`;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open message app");
    }
  };

const triggerSOS = async () => {
  try {
    setSent(true);
    startAnimation();
    // Get Saved Contacts
    const saved = await AsyncStorage.getItem(
      "favoriteContacts"
    );
    if (!saved) {
      Alert.alert("No Contacts Saved");
      return;
    }
    const contacts = JSON.parse(saved);
    const validContacts = contacts.filter(
      (item: any) =>
        item.number &&
        item.number.trim() !== ""
    );

    if (validContacts.length === 0) {
      Alert.alert("No Valid Contacts");
      return;
    }
    // Primary Contact
    const primary =
      validContacts.find(
        (item: any) =>
          item.primary === true
      ) || validContacts[0];

    // Get Live Location
    let mapLink = "Location unavailable";
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const current =
          await Location.getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.High
          });

        const lat =
          current.coords.latitude;

        const lng =
          current.coords.longitude;
        mapLink =
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
    } catch {}
    const smsAvailable =
      await SMS.isAvailableAsync();

    if (smsAvailable) {
      const numbers =
        validContacts.map(
          (item: any) =>
            item.number.trim()
        );

      const message =
        `🚨 HELP NEEDED!\n\n` +
        `Please contact me urgently.\n\n` +
        `Live Location:\n${mapLink}`;

      await SMS.sendSMSAsync(
        numbers,
        message
      );
    }

    // Open Call Immediately
    await Linking.openURL(
      `tel:${primary.number}`
    );

    // Save Alert History
    const time =
      new Date().toLocaleString();

    const updated = [
      `🚨 Emergency Alert Sent - ${time}`,
      ...alertHistory
    ];
    setAlertHistory(updated);
    await AsyncStorage.setItem(
      "alertHistory",
      JSON.stringify(updated)
    );

  } catch (error) {
    Alert.alert(
      "Emergency action failed"
    );
  }
};
  const resetSOS = () => {
    setSent(false);
  };
  const bg =
    darkMode ? "#05070f" : "#f8fafc";

  const cardBg =
    darkMode ? "#0f172a" : "#ffffff";

  const modalBg =
    darkMode ? "#111827" : "#ffffff";

  const text =
    darkMode ? "#ffffff" : "#000000";

  const subText =
    darkMode ? "#94a3b8" : "#334161";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg }
      ]}
    >
      <StatusBar
  barStyle={
    darkMode
      ? "light-content"
      : "dark-content"
  }
  backgroundColor={bg}
/>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: text }
            ]}
          >
            SILENT SIGNAL
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: subText }
            ]}
          >
            Tap HELP NOW for emergency alert
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 14
            }}
          >
            <Text
              style={{
                color: text,
                marginRight: 10
              }}
            >
              {darkMode
                ? "DARK"
                : "LIGHT"}
            </Text>

            <Switch
              value={darkMode}
              onValueChange={toggleTheme}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.historyBtn,
            { backgroundColor: cardBg }
          ]}
          onPress={() =>
            setHistoryVisible(true)
          }
        >
          <Text
            style={[
              styles.historyText,
              { color: text }
            ]}
          >
            Alert History
          </Text>
        </TouchableOpacity>

        <View style={styles.sosWrapper}>
          <View
            style={[
              styles.ringOuter,
              sent &&
                styles.ringOuterActive
            ]}
          />
          <View
            style={[
              styles.ringMiddle,
              sent &&
                styles.ringMiddleActive
            ]}
          />
          <Animated.View
            style={{
              transform: [{ scale }]
            }}
          >
            <TouchableOpacity
              style={[
                styles.sosButton,
                sent &&
                  styles.sosActive
              ]}
              onPress={triggerSOS}
            >
              <Text style={styles.sosText}>
                {sent
                  ? "SENT"
                  : "HELP NOW"}
              </Text>
              <Text style={styles.sosSub}>
                Emergency Help
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Text
          style={[
            styles.sectionTitle,
            { color: text }
          ]}
        >
          Quick Actions
        </Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: cardBg }
            ]}
            onPress={() =>
              makeCall("112")
            }
          >
            <Text style={styles.cardIcon}>
              🚔
            </Text>
            <Text
              style={[
                styles.cardText,
                { color: text }
              ]}
            >
              Police
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: cardBg }
            ]}
            onPress={() =>
              makeCall("108")
            }
          >
            <Text style={styles.cardIcon}>
              🚑
            </Text>
            <Text
              style={[
                styles.cardText,
                { color: text }
              ]}
            >
              Ambulance
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.cardFull,
            { backgroundColor: cardBg }
          ]}
          onPress={resetSOS}
        >
          <Text style={styles.cardIcon}>
            🔄
          </Text>
          <Text
            style={[
              styles.cardText,
              { color: text }
            ]}
          >
            Reset
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.sectionTitle,
            { color: text }
          ]}
        >
          Trusted Contacts
        </Text>

        {[
          "Father",
          "Mother",
          "Friend"
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.contactCard,
              { backgroundColor: cardBg }
            ]}
            onPress={() =>
              makeCall("9058627761")
            }
          >
            <Text
              style={[
                styles.contactText,
                { color: text }
              ]}
            >
              👤 {item}
            </Text>

            <Text style={styles.call}>
              Call
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        visible={historyVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalWrap}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor:
                  modalBg
              }
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: text }
              ]}
            >
              Alert History
            </Text>
            <ScrollView>
              {alertHistory.length ===
              0 ? (
                <Text
                  style={[
                    styles.empty,
                    {
                      color:
                        subText
                    }
                  ]}
                >
                  No Alerts Yet
                </Text>
              ) : (
                alertHistory.map(
                  (item, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.historyItem,
                        {
                          color:
                            text,
                          backgroundColor:
                            cardBg
                        }
                      ]}
                    >
                      {item}
                    </Text>
                  )
                )
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() =>
                setHistoryVisible(
                  false
                )
              }
            >
              <Text
                style={
                  styles.closeText
                }
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    padding: 22,
    paddingBottom: 50
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold"
  },
  subtitle: {
    marginTop: 6
  },
  historyBtn: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center"
  },
  historyText: {
    fontWeight: "600"
  },
  sosWrapper: {
    width: 280,
    height: 280,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25
  },
  ringOuter: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor:
      "rgba(53, 239, 25, 0.15)"
  },
  ringMiddle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor:
      "rgba(217, 255, 0, 0.25)"
  },
  ringOuterActive: {
    borderColor:
      "rgba(38, 240, 78, 0.18)"
  },
  ringMiddleActive: {
    borderColor:
      "rgba(34,197,94,0.30)"
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center"
  },
  sosActive: {
    backgroundColor: "#22c55e"
  },
  sosText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold"
  },
  sosSub: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 14
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between"
  },
  card: {
    width: "48%",
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12
  },
  cardFull: {
    width: "100%",
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12
  },
  cardIcon: {
    fontSize: 35
  },
  cardText: {
    marginTop: 6
  },
  contactCard: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },
  contactText: {},
  call: {
    color: "#60a5fa"
  },
  modalWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:
      "rgba(0,0,0,0.7)",
    padding: 20
  },
  modalBox: {
    borderRadius: 16,
    padding: 20,
    maxHeight: "75%"
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  historyItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  empty: {
    textAlign: "center"
  },
  closeBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});