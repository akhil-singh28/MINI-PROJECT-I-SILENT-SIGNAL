import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://192.168.137.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();

    if (data.success) {

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.replace("/(tabs)");

    } else {
      Alert.alert("Invalid Credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Phone"
        style={styles.input}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={login}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:20},
  title:{fontSize:30,fontWeight:"bold",marginBottom:20,textAlign:"center"},
  input:{borderWidth:1,padding:12,borderRadius:10,marginBottom:10},
  btn:{backgroundColor:"green",padding:15,borderRadius:10},
  btnText:{color:"#fff",textAlign:"center",fontWeight:"bold"}
});