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
      <View style={styles.container}>
        {imgLoaded ? (
          <View>
            <Image
                source={{ uri: imgUrl }}
                style={styles.image}
            />
            <GestureHandlerRootView style={styles.container}>
              <GestureDetector gesture={composed}>
                {/* <Animated.View style={[styles.boxWrapper, animatedStyles]}>
                  <Animated.View style={styles.box} />
                </Animated.View> */}
                <Animated.View style={[animatedStyles, styles.box]}/>
              </GestureDetector>
            </GestureHandlerRootView>
          </View>
        ) : (
          <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
        )}
      </View>
      {imgLoaded ? (
        <View>
          <Text>Angle: </Text>
          <TextInput keyboardType="numeric" value={angle} onChangeText={newAngle => onAngleChange(newAngle)} />
          <Text>Number of digits: </Text>
          <TextInput keyboardType="numeric" value={digits} onChangeText={newDigits => onChangeDigits(newDigits)} />
          <Text>Number of decimal places: </Text>
          <TextInput keyboardType="numeric" value={decimals} onChangeText={newDecimal => onChangeDecimals(newDecimal)} />
          <Text>Recognition result: {result}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    marginBottom: 20,
  },
  boxContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  box: {
    position: 'absolute',
    width: 100,
    height: 50,
    borderColor: 'yellow',
    borderWidth: 3
  },
  boxWrapper: {
    // Increase the hit area of the bounding box
    padding: 20, // Increase this to extend the tappable area
    margin: -20, // Match padding to keep the box centered
  },
});
