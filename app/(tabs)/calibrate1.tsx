import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button, SafeAreaView } from "react-native";
import { useAppContext } from '../context';
import { deviceDetails, getPicture, uploadCutoutPic } from "@/API/api";
import Animated, { useAnimatedStyle, useSharedValue, withClamp } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

export default function Calibrate() {
  const [decimals, onChangeDecimals] = useState('');
  const [digits, onChangeDigits] = useState('');
  const [meterID, onChangeMeterID] = useState(1800);
  const [angle, onAngleChange] = useState('');
  const [result, onResultChange] = useState(0);
  const [imgPath, updateImagePath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgLoaded, onImgLoad] = useState(false);
  const { authToken, qrCode } = useAppContext();
  const [imgDimensions, setDimensions] = useState({ width: 0, height: 0 }); 

  // Function to fetch product key using API
  async function getProductKey() {
    try {
      const details = await deviceDetails(authToken, qrCode);
      return details.productKey;
    } catch (error) {
      throw error;
    }
  }

  // Function to fetch the device configuration image from the API
  async function getDeviceConfigImage() {
    try {
      const product = await getProductKey();
      const path = await getPicture(authToken, qrCode, product);
      updateImagePath(path);
    } catch (error) {
      console.log("Error in getting device image");
    }
  }

  // Function to load the image and dynamically set the bounding box size
  function loadImage() {
    onImgLoad(true);
    const url = "http://20.53.98.203" + imgPath;
    setImgUrl(url);

    // Dynamically get the actual dimensions of the image
    Image.getSize(
      url,
      (width, height) => {
        setDimensions({ width, height });  // Set image dimensions
        // Dynamically set the initial bounding box size based on image dimensions (e.g., 20% of width, 10% of height)
        boxWidth.value = width * 0.2;
        boxHeight.value = height * 0.1;
      },
      (error) => {
        console.error('Error fetching image dimensions:', error);
      }
    );
    console.log("IMAGE URL: ", url);
  }

  // Shared values for animations and transformations
  const translateX = useSharedValue(0);  // X translation of the bounding box
  const translateY = useSharedValue(0);  // Y translation of the bounding box
  const scale = useSharedValue(1);  // Scaling value (currently unused, but can be used for additional features)
  const boxWidth = useSharedValue(0);  // Dynamic bounding box width
  const boxHeight = useSharedValue(0);  // Dynamic bounding box height

  // Pan gesture handler for moving the bounding box
  const pan = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((event) => {
      const maxTranslateX = imgDimensions.width - boxWidth.value;  // Calculate max translation based on image width
      const maxTranslateY = imgDimensions.height - boxHeight.value;  // Calculate max translation based on image height

      // Clamp the translation to keep the bounding box within the image boundaries
      translateX.value = withClamp(
        translateX.value + event.translationX,
        0,
        Math.max(maxTranslateX, 0)
      );
      translateY.value = withClamp(
        translateY.value + event.translationY,
        0,
        Math.max(maxTranslateY, 0)
      );
    })
    .runOnJS(true);

  // Pinch gesture handler for resizing the bounding box
  const pinch = Gesture.Pinch()
    .onStart(() => {})
    .onUpdate((event) => {
      // Dynamically adjust bounding box width and height based on pinch scale
      const newWidth = boxWidth.value * event.scale;
      const newHeight = boxHeight.value * event.scale;

      // Clamp the bounding box size to prevent it from exceeding image boundaries
      boxWidth.value = withClamp(newWidth, 50, imgDimensions.width);  // Minimum width of 50
      boxHeight.value = withClamp(newHeight, 25, imgDimensions.height);  // Minimum height of 25
    })
    .runOnJS(true);

  // Animated styles for bounding box transformation
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // Animated styles for bounding box size
  const boxStyles = useAnimatedStyle(() => ({
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  // Compose gestures for simultaneous handling
  const composed = Gesture.Simultaneous(pan, pinch);

  return (
    <SafeAreaView style={styles.container}>
      {imgLoaded ? (
        <>
          <GestureHandlerRootView style={styles.gestureHandler}>
            <GestureDetector gesture={composed}>
              <View style={styles.container}>
                <Image source={{ uri: imgUrl }} style={styles.image} />
                <Animated.View style={[animatedStyles, styles.box, boxStyles]} />
              </View>
            </GestureDetector>
          </GestureHandlerRootView>
        </>
      ) : (
        <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
      )}
      <Button title="Load Config" onPress={loadImage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholder: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    marginBottom: 20,
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  gestureHandler: {
    flex: 1,
    width: '100%'
  },
  box: {
    borderColor: 'yellow',
    borderWidth: 3,
    zIndex: 1,
  },
});
