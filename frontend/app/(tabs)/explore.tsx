import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView
} from "react-native";

import { useState, useEffect, useCallback } from "react";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "../../utils/language";
import { useFocusEffect } from "@react-navigation/native";

export default function Explore() {
  const [recording, setRecording] = useState<any>(null);
  const [audioUri, setAudioUri] = useState("");
  const [photo, setPhoto] = useState("");
  const [language, setLanguage] = useState("en");

  const [recordings, setRecordings] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [sound, setSound] = useState<any>(null);

  const [darkMode, setDarkMode] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadLanguage();
      loadRecordings();
      loadPhotos();
      loadTheme();
    }, [])
  );

  const t = translations[language as "en" | "hi"];

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const text = darkMode ? "#fff" : "#111827";
  const subText = darkMode ? "#94a3b8" : "#475569";
  const inputBg = darkMode ? "#334155" : "#e2e8f0";

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
    else setDarkMode(true);
  };
  // LOAD LANGUAGE
  const loadLanguage = async () => {
    const saved = await AsyncStorage.getItem("language");
    if (saved) setLanguage(saved);
  };
  // LOAD RECORDINGS
  const loadRecordings = async () => {
    const saved = await AsyncStorage.getItem("recordings");
    if (saved) setRecordings(JSON.parse(saved));
  };
  // LOAD PHOTOS
  const loadPhotos = async () => {
    const saved = await AsyncStorage.getItem("photos");
    if (saved) setPhotos(JSON.parse(saved));
  };
  // SAVE RECORDINGS
  const saveRecordings = async (list: any[]) => {
    setRecordings(list);
    await AsyncStorage.setItem(
      "recordings",
      JSON.stringify(list)
    );
  };
  // SAVE PHOTOS
  const savePhotos = async (list: any[]) => {
    setPhotos(list);
    await AsyncStorage.setItem(
      "photos",
      JSON.stringify(list)
    );
  };
  // START RECORDING
  const startRecording = async () => {
    try {
      const permission =
        await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone Permission Denied");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });
      const { recording } =
        await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
      setRecording(recording);
    } catch (error) {
      Alert.alert("Error");
    }
  };
  // STOP RECORDING
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setAudioUri(uri);
        const newItem = {
          uri,
          date: new Date().toLocaleString()
        };
        const updated = [newItem, ...recordings];
        await saveRecordings(updated);
      }
      setRecording(null);
      Alert.alert("Recording Saved");
    } catch (error) {
      Alert.alert("Stop Recording Failed");
    }
  };
  // PLAY CURRENT RECORDING
  const playRecording = async () => {
    try {
      if (!audioUri) {
        Alert.alert("No Recording Found");
        return;
      }
      const { sound } =
        await Audio.Sound.createAsync({
          uri: audioUri
        });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      Alert.alert("Play Failed");
    }
  };
  // PLAY HISTORY RECORDING
  const playHistoryRecording = async (uri: string) => {
    try {
      const { sound } =
        await Audio.Sound.createAsync({
          uri
        });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      Alert.alert("Cannot Play Recording");
    }
  };
  // DELETE RECORDING
  const deleteRecording = async (index: number) => {
    const updated = recordings.filter(
      (_, i) => i !== index
    );
    await saveRecordings(updated);
  };
  // OPEN CAMERA
  const openCamera = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Camera Permission Denied");
        return;
      }
      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
          quality: 1
        });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhoto(uri);
        const newPhoto = {
          uri,
          date: new Date().toLocaleString()
        };
        const updated = [newPhoto, ...photos];
        await savePhotos(updated);
        Alert.alert("Photo Captured");
      }
    } catch (error) {
      Alert.alert("Camera Error");
    }
  };
  // DELETE PHOTO
  const deletePhoto = async (index: number) => {
    const updated = photos.filter(
      (_, i) => i !== index
    );
    await savePhotos(updated);
  };
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:bg}]}>
      <Text style={[styles.title,{color:text}]}>
        {t.explore}
      </Text>
      <Text style={[styles.subtitle,{color:subText}]}>
        Audio & Photo Evidence
      </Text>
      {/* AUDIO */}
      <Text style={[styles.sectionTitle,{color:text}]}>
        Voice Recorder
      </Text>
      {!recording ? (
        <TouchableOpacity
          style={styles.recordBtn}
          onPress={startRecording}
        >
          <Text style={styles.btnText}>
            🎤 START RECORDING
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.stopBtn}
          onPress={stopRecording}
        >
          <Text style={styles.btnText}>
            ⏹ Stop Recording
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.playBtn}
        onPress={playRecording}
      >
        <Text style={styles.btnText}>
          ▶ PLAY RECORDING
        </Text>
      </TouchableOpacity>
      {/* RECORDING HISTORY */}
      <Text style={[styles.sectionTitle,{color:text}]}>
        Recording History
      </Text>
      {recordings.length === 0 ? (
        <Text style={[styles.empty,{color:subText}]}>
          No recordings yet
        </Text>
      ) : (
        recordings.map((item, index) => (
          <View
            key={index}
            style={[styles.historyCard,{backgroundColor:cardBg}]}
          >
            <Text style={[styles.historyText,{color:text}]}>
              RECORDING {recordings.length - index}
            </Text>
            <Text style={[styles.historyDate,{color:subText}]}>
              {item.date}
            </Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.smallPlay}
                onPress={() =>
                  playHistoryRecording(item.uri)
                }
              >
                <Text style={styles.btnText}>
                  Play
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  deleteRecording(index)
                }
              >
                <Text style={styles.btnText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      {/* CAMERA */}
      <Text style={[styles.sectionTitle,{color:text}]}>
        Photo Evidence
      </Text>
      <TouchableOpacity
        style={styles.cameraBtn}
        onPress={openCamera}
      >
        <Text style={styles.btnText}>
          OPEN CAMERA
        </Text>
      </TouchableOpacity>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={styles.image}
        />
      ) : null}
      {/* PHOTO HISTORY */}
      <Text style={[styles.sectionTitle,{color:text}]}>
        Photo History
      </Text>
      {photos.length === 0 ? (
        <Text style={[styles.empty,{color:subText}]}>
          No photos yet
        </Text>
      ) : (
        photos.map((item, index) => (
          <View
            key={index}
            style={[styles.historyCard,{backgroundColor:cardBg}]}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.historyImage}
            />
            <Text style={[styles.historyDate,{color:subText}]}>
              {item.date}
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                deletePhoto(index)
              }
            >
              <Text style={styles.btnText}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12
  },
  recordBtn: {
    width: "100%",
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  stopBtn: {
    width: "100%",
    backgroundColor: "#eba428",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  playBtn: {
    width: "100%",
    backgroundColor: "#1f52c1",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  cameraBtn: {
    width: "100%",
    backgroundColor: "#1bbd57",
    padding: 15,
    borderRadius: 12,
    marginBottom: 18
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
  image: {
    width: 300,
    height: 380,
    borderRadius: 15,
    marginBottom: 20
  },

  historyCard: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12
  },

  historyText: {
    fontSize: 16,
    fontWeight: "bold"
  },

  historyDate: {
    marginTop: 6,
    marginBottom: 10
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  smallPlay: {
    backgroundColor: "#1f52c1",
    padding: 10,
    borderRadius: 10,
    width: "48%"
  },

  deleteBtn: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 10
  },

  historyImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 10
  },

  empty: {
    marginBottom: 10
  }
});