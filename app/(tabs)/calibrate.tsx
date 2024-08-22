import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Image, Button } from "react-native";
import { useAuth } from '../context';
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function calibrate() {
    const [decimals, onChangeDecimals] = useState('');
    const [digits, onChangeDigits] = useState('');
    const [meterID, onChangeMeterID] = useState(1800);
    const [angle, onAngleChange] = useState(0);
    const [result, onResultChange] = useState(0);
    const [imgPath, updateImagePath] = useState('');
    const [imgLoaded, onImgLoad] = useState(false);

    function loadImage(){

    }

  // URL of the image to show after button press
  const imageUrl = 'https://example.com/your-image.jpg';

  return (
    <View style={styles.container}>
      {imgLoaded ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.placeholder}>Press the button to load the image</Text>
      )}

      <Button
        title="Press me"
        onPress={() => onImgLoad(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});