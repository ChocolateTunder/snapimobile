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
      <View>
        <Text style={styles.viewport}>Image adjustment component</Text>
        <Text>Meter ID:  {meterID}</Text>
        <Text>Current angle:  {angle}</Text>
        <Text>Enter number of digits: <TextInput style={styles.input} onChangeText={onChangeDigits} value={digits} placeholder="Enter number of digits" keyboardType="numeric"/></Text>
        <Text>Number of decimal places: <TextInput style={styles.input} onChangeText={onChangeDecimals} value={decimals} placeholder="Enter how many numbers are decimals" keyboardType="numeric"/></Text>
        <Text>Recognition result:  {result}</Text>
        <Pressable>Update Configuration</Pressable>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        alignSelf: 'center'
    },
    viewport: {
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 3,
        maxWidth: '50%',
        padding: 40,
        marginTop: 20,
        alignSelf: 'center'
    }
  });