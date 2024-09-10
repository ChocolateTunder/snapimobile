import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button, SafeAreaView } from "react-native";
import Svg, { Rect } from 'react-native-svg';
import { useAppContext } from '../context';
import { deviceDetails, getPicture, uploadCutoutPic } from "@/API/api";
import Animated, { useAnimatedStyle, useSharedValue, withClamp, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from "react-native-gesture-handler";

export default function Calibrate() {
  const [decimals, onChangeDecimals] = useState('');
  const [digits, onChangeDigits] = useState('');
  const [meterID, onChangeMeterID] = useState(1800);
  const [angle, onAngleChange] = useState('');
  const [result, onResultChange] = useState(0);
  const [imgPath, updateImagePath] = useState('');
  const [tempImgPath, updateTempImgPath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgLoaded, onImgLoad] = useState(false);
  const { authToken, qrCode } = useAppContext();
  const [imgDimensions, setDimensions] = useState({width: 0, height: 0}); 

  async function getProductKey() {
    try {
      const details = await deviceDetails(authToken, qrCode);
      return details.productKey;
    } catch (error) {
      throw error;
    }
  }

  async function getDeviceConfigImage() {
    try {
      const product = await getProductKey();
      console.log("Product key: ", product);
      const path = await getPicture(authToken, qrCode, product);
      updateImagePath(path);
    } catch (error) {
      console.log("Error in getting device image");
    }
  }

  function loadImage() {
    onImgLoad(true);
    const url = "http://20.53.98.203" + imgPath;
    setImgUrl(url);
    
    // Image.getSize(url, (width, height) => {
    //   setDimensions({ width, height });
    // }, (error) => {
    //   console.error('Error fetching image dimensions:', error);
    // });

    // translateX.value = imgDimensions.width / 2;
    // translateY.value = imgDimensions.height / 2;
    console.log("IMAGE URL: ", url);

  }

  function convertToBase64(url: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        return new Promise((resolve) => {
          fileReader.onloadend = () => {
            resolve(fileReader.result?.toString());
          };
        });
      });
    return 'Calibration Error';
  }

  async function createCutout(imagePath: string, token: string) {
    try {
      const img64: string = convertToBase64(imagePath);
      const path = await uploadCutoutPic(img64, token);
      updateTempImgPath(path);
      console.log("Temp img path: ", tempImgPath);
    } catch (error) {
      console.log("Error in creating cutout");
    }
  }

  function identify() {
    createCutout(imgPath, authToken);
  }

  useEffect(() => {
    getDeviceConfigImage();
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevX = useSharedValue(0);
  const prevY = useSharedValue(0);
  const scale = useSharedValue(1);
  const newScale = useSharedValue(0);
  const currentangle = useSharedValue(0);
  const newAngle = useSharedValue(0);

  const pan = Gesture.Pan().minDistance(1)
    .onStart(() => {
      prevX.value = translateX.value;
      prevY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = prevX.value + event.translationX;
      translateY.value = prevY.value + event.translationY;
      // const boundX = Math.min(
      //   Math.max(prevX.value + event.translationX, 0),
      //   imgDimensions.width - prevX.value * scale.value
      // );

      // const boundY = Math.min(
      //   Math.max(prevY.value + event.translationY, 0),
      //   imgDimensions.height - prevY.value * scale.value
      // );

      // translateX.value = boundX;
      // translateY.value = boundY;
  }).runOnJS(true);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      newScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = newScale.value * event.scale;
  }).runOnJS(true);

  const rotation = Gesture.Rotation()
    .onStart(() => {
      newAngle.value = currentangle.value;
    }).onUpdate((event) => {
      currentangle.value = newAngle.value + event.rotation;
  });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${currentangle.value}rad` },
      { scale: scale.value }
    ],
  }));

  const composed = Gesture.Simultaneous(pan, pinch, rotation);


  return (
    <SafeAreaView style={styles.container}>
    
        {imgLoaded ? (
          <>
              <GestureHandlerRootView style={styles.gestureHandler}>
              <GestureDetector gesture={composed}>
                {/* <Animated.View style={[styles.boxWrapper, animatedStyles]}>
                  <Animated.View style={styles.box} />
                </Animated.View> */}
                <View style={styles.container}>
                  <Image
                  source={{ uri: imgUrl }}
                  style={styles.image}
                  />
                  <Animated.View style={[animatedStyles, styles.box]}/>
                </View>
              </GestureDetector>
              </GestureHandlerRootView>
          </>
        ) : (
          <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
        )}
      {imgLoaded ? (
        <View>
          <Text style={styles.label}>Angle: </Text>
          <TextInput keyboardType="numeric" value={angle} onChangeText={newAngle => onAngleChange(newAngle)} />
          <Text style={styles.label}>Number of digits: </Text>
          <TextInput keyboardType="numeric" value={digits} onChangeText={newDigits => onChangeDigits(newDigits)} />
          <Text style={styles.label}>Number of decimal places: </Text>
          <TextInput keyboardType="numeric" value={decimals} onChangeText={newDecimal => onChangeDecimals(newDecimal)} />
          <Text style={styles.label}>Recognition result: {result}</Text>
          <Button title="Identify" onPress={identify} />
        </View>
      ) : (
        <Button title="Load Config" onPress={loadImage} />
      )}
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A2E', // Sleek dark background for a modern look
    paddingHorizontal: 20, // Adding padding for better layout on all devices
  },
  placeholder: {
    fontSize: 20, // Emphasized text for better readability
    marginBottom: 20,
    textAlign: 'center',
    color: '#ecf0f1', // Light color for strong contrast
    fontStyle: 'italic', // Adding a stylish, unique flair
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Subtle shadow for depth
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    flex: 1,
    resizeMode: 'contain', // Ensures image fits within the view
    marginBottom: 20,
    width: '100%',
    height: '100%',
    borderRadius: 10, // Rounded corners for a more modern look
    shadowColor: '#000', // Shadow for depth and visual separation
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4, // Adding elevation for Android devices
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Light background to separate image
  },
  gestureHandler: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Light transparent overlay
    borderRadius: 15, // Rounded corners for smooth interaction
    padding: 10, // Padding to avoid edges touching
    marginVertical: 10, // Vertical margins for spacing between elements
  },
  box: {
    width: 120,
    height: 60,
    borderColor: 'rgba(255, 255, 0, 0.8)', // Soft yellow border for visibility
    borderWidth: 4,
    borderRadius: 10, // Rounded corners for smoother edges
    backgroundColor: 'rgba(255, 255, 0, 0.2)', // Transparent yellow for a pop of color
    shadowColor: '#FFC300', // Matching shadow color for a subtle glow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 6, // More elevation for a pronounced depth effect
  },
  inputContainer: {
    marginVertical: 10, // Margin for spacing inputs
    width: '80%', // Make input width responsive
    alignItems: 'center', // Centering input fields for clean layout
  },
  input: {
    height: 40,
    borderColor: '#ecf0f1',
    borderWidth: 1,
    borderRadius: 8, // Rounded input fields for a smoother look
    paddingHorizontal: 10, // Adding padding for comfortable typing
    color: '#ecf0f1',
    backgroundColor: '#2C3E50', // Darker background for input with contrast
    marginVertical: 5, // Spacing between input fields
    fontSize: 16, // Comfortable text size
    width: '100%', // Responsive width
  },
  label: {
    color: '#ecf0f1', // Light label color for contrast
    fontSize: 16, // Slightly larger for readability
    marginBottom: 5, // Space between label and input
  },
  button: {
    backgroundColor: '#2980b9', // Vibrant blue button for standout
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners for modern button style
    marginTop: 20, // Space between button and content
    shadowColor: '#000', // Button shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  buttonText: {
    color: '#fff', // White text for contrast
    fontSize: 18, // Slightly larger for visibility
    fontWeight: 'bold',
    textAlign: 'center', // Centering the button text
  },
});

