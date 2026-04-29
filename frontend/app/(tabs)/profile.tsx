import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(true);

  const [contacts, setContacts] = useState([
    {
      name: "",
      relation: "",
      number: "",
      primary: true
    },
    {
      name: "",
      relation: "",
      number: "",
      primary: false
    },
    {
      name: "",
      relation: "",
      number: "",
      primary: false
    }
  ]);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
      loadTheme();
    }, [])
  );

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");

    if (saved === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  };

  // LOAD CONTACTS
  const loadContacts = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        "favoriteContacts"
      );

      if (saved) {
        setContacts(JSON.parse(saved));
      }
    } catch (error) {}
  };

  // UPDATE FIELD
  const updateField = (
    index: number,
    key: string,
    value: string
  ) => {
    const updated = [...contacts];
    updated[index][key] = value;
    setContacts(updated);
  };

  // SET PRIMARY CONTACT
  const setPrimary = (index: number) => {
    const updated = contacts.map(
      (item, i) => ({
        ...item,
        primary: i === index
      })
    );

    setContacts(updated);
  };

const saveContacts = async () => {
  try {
    let updatedContacts = [...contacts];

    // MUST HAVE AT LEAST ONE NUMBER
    const filled = updatedContacts.filter(
      (item) =>
        item.number &&
        item.number.trim() !== ""
    );

    if (filled.length === 0) {
      Alert.alert(
        "Please enter at least one contact number"
      );
      return;
    }

    // CHECK PRIMARY CONTACT
    const primaryIndex =
      updatedContacts.findIndex(
        (item) =>
          item.primary === true &&
          item.number.trim() !== ""
      );

    // IF PRIMARY EMPTY => AUTO SET FIRST FILLED CONTACT
    if (primaryIndex === -1) {
      const firstFilled =
        updatedContacts.findIndex(
          (item) =>
            item.number &&
            item.number.trim() !== ""
        );

      updatedContacts =
        updatedContacts.map(
          (item, index) => ({
            ...item,
            primary:
              index === firstFilled
          })
        );
    }

    // SAVE TO STORAGE
    await AsyncStorage.setItem(
      "favoriteContacts",
      JSON.stringify(updatedContacts)
    );

    // UPDATE STATE
    setContacts(updatedContacts);

    // SHOW PRIMARY
    const primary =
      updatedContacts.find(
        (item) => item.primary
      );

    Alert.alert(
      "Contacts Saved Successfully",
      `Primary Contact: ${
        primary?.name || primary?.number
      }\n\nHELP NOW will:\n📞 Call Primary Contact\n📩 Send SMS + Location to Others`
    );

  } catch (error) {
    Alert.alert("Unable to Save Contacts");
  }
};

  const bg = darkMode ? "#0f172a" : "#ffffff";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const inputBg = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#fff" : "#111827";
  const subText = darkMode ? "#94a3b8" : "#475569";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: bg }
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: text }
        ]}
      >
        Profile
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: subText }
        ]}
      >
        Save Your 3 Favourite Emergency Contacts
      </Text>

      {contacts.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: cardBg }
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: text }
            ]}
          >
            Contact {index + 1}
          </Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#94a3b8"
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: text
              }
            ]}
            value={item.name}
            onChangeText={(text) =>
              updateField(index, "name", text)
            }
          />

          <TextInput
            placeholder="Relation"
            placeholderTextColor="#94a3b8"
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: text
              }
            ]}
            value={item.relation}
            onChangeText={(text) =>
              updateField(index, "relation", text)
            }
          />

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#94a3b8"
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: text
              }
            ]}
            keyboardType="phone-pad"
            value={item.number}
            onChangeText={(text) =>
              updateField(index, "number", text)
            }
          />

          {/* PRIMARY BUTTON */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              item.primary &&
                styles.primaryActive
            ]}
            onPress={() =>
              setPrimary(index)
            }
          >
            <Text
              style={
                styles.primaryText
              }
            >
              {item.primary
                ? "✓ Primary Contact"
                : "Set As Primary"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveContacts}
      >
        <Text style={styles.saveText}>
          Save Contacts
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 25,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 25,
    textAlign: "center"
  },

  card: {
    padding: 15,
    borderRadius: 14,
    marginBottom: 18
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10
  },

  primaryBtn: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 10,
    marginTop: 5
  },

  primaryActive: {
    backgroundColor: "#2563eb"
  },

  primaryText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold"
  },

  saveBtn: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 40
  },

  saveText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold"
  }
});