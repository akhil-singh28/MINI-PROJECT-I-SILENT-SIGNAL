import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [sent, setSent] = useState(false);
  const sendSMS = () => {
    const phoneNumber = '___________________________________'; // apna emergency wala number likhna hai 
    const message = 'Emergency! I need help. Location: Mathura';

    Linking.openURL(`sms:${phoneNumber}?body=${message}`);
  };
  const handlePress = async () => {
    try {
      const response = await fetch("_______________________________________________", {   
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: 101,
          location: "Mathura"
        })
      });

      const data = await response.json();
      console.log(data);
      sendSMS();

      setSent(true);
    } catch (error) {
      alert("Error connecting to server");
    }
  };
  const handleReset = () => {
    setSent(false);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Emergency</Text>
      <Text style={styles.subtitle}>
        {sent ? "Alert Sent Successfully" : "Tap the button to send an immediate alert"}
      </Text>
      <TouchableOpacity
        style={[styles.button, sent && styles.greenButton]}
        onPress={handlePress}
        disabled={sent}
      >
        <Text style={styles.buttonText}>
          {sent ? "✔ SENT" : "⚡ HELP NOW"}
        </Text>
      </TouchableOpacity>

      {sent && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#0f172a'
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  button: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#ef2424',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20
  },
  greenButton: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e'
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  resetButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#8693a7',
    borderRadius: 10
  },
  resetText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
