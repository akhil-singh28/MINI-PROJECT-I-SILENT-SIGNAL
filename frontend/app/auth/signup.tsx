import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    guardian_name: "",
    guardian_phone: ""
  });

  const signup = async () => {
    const res = await fetch("http://YOUR_IP:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    Alert.alert(data.message);
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput placeholder="Name" style={styles.input}
        onChangeText={(text) => setForm({...form,name:text})} />

      <TextInput placeholder="Phone" style={styles.input}
        onChangeText={(text) => setForm({...form,phone:text})} />

      <TextInput placeholder="Password" secureTextEntry style={styles.input}
        onChangeText={(text) => setForm({...form,password:text})} />

      <TextInput placeholder="Guardian Name" style={styles.input}
        onChangeText={(text) => setForm({...form,guardian_name:text})} />

      <TextInput placeholder="Guardian Phone" style={styles.input}
        onChangeText={(text) => setForm({...form,guardian_phone:text})} />

      <TouchableOpacity style={styles.btn} onPress={signup}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:20},
  title:{fontSize:30,fontWeight:"bold",marginBottom:20,textAlign:"center"},
  input:{borderWidth:1,padding:12,borderRadius:10,marginBottom:10},
  btn:{backgroundColor:"red",padding:15,borderRadius:10},
  btnText:{color:"#fff",textAlign:"center",fontWeight:"bold"}
});