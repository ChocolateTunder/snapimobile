import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function calibrate() {
  const [decimals, onChangeDecimals] = useState('');
  const [digits, onChangeDigits] = useState('');
  const [meterID, onChangeMeterID] = useState(1800);
  const [angle, onAngleChange] = useState(0);
  const [result, onResultChange] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.viewport}>Image Adjustment Component</Text>
      <Text style={styles.label}>Meter ID: <Text style={styles.value}>{meterID}</Text></Text>
      <Text style={styles.label}>Current Angle: <Text style={styles.value}>{angle}</Text></Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Number of Digits: </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDigits}
          value={digits}
          placeholder="Enter number of digits"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Decimal Places: </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDecimals}
          value={decimals}
          placeholder="Enter how many decimals"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Recognition Result: <Text style={styles.value}>{result}</Text></Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Update Configuration</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1A1A2E', // Dark background for a sleek look
  },
  viewport: {
    borderColor: 'rgba(255, 99, 71, 0.8)', // Softened red with transparency
    borderWidth: 3,
    maxWidth: '70%', // Slightly wider for better layout
    padding: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ecf0f1', // Light color for contrast
    alignSelf: 'center',
    borderRadius: 15, // Rounded corners for smooth look
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background
    shadowColor: '#e74c3c', // Matching shadow with border color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4, // Deeper shadow for Android
  },
  label: {
    color: '#ecf0f1',
    fontSize: 18, // Slightly larger for readability
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  value: {
    fontWeight: 'bold',
    color: '#f39c12', // Vibrant color for dynamic data
  },
  inputGroup: {
    marginVertical: 10, // Spacing between input fields
  },
  input: {
    height: 45,
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#2980b9', // Soft, vibrant color for border
    padding: 12, // Padding inside input for spacing
    borderRadius: 10, // Rounded corners for smoother look
    backgroundColor: '#ecf0f1', // Light background for readability
    color: '#333', // Dark text color for readability
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android
  },
  button: {
    backgroundColor: '#2980b9', // Blue background for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000', // Button shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android
  },
  buttonText: {
    color: '#fff', // White text for contrast
    fontWeight: 'bold',
    textAlign: 'center', // Center text in button
  },
});
