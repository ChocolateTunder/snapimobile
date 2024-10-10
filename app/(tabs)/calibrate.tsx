import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button, SafeAreaView, useWindowDimensions } from "react-native";
import Svg, { Rect } from 'react-native-svg';
import { useAppContext } from '../context';
import { deviceDetails, getPicture, uploadCutoutPic } from "@/API/api";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withClamp, withSpring, clamp } from "react-native-reanimated";
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
  const [imgViewDimensions, setImgViewDimensions] = useState({width: 0, height: 0, x:0, y:0});
  const [imgDimensions, setImgDimensions] = useState({width: 0, height: 0});
  const [boxSize, setBoxSize] = useState({width: 0, height: 0}); 
  const { authToken, qrCode } = useAppContext();
  const {height, width} = useWindowDimensions();

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
      //console.log("Product key: ", product);
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
    
    Image.getSize(url, (width, height) => {
      setImgDimensions({ width: width, height: height });
    }, (error) => {
      console.error('Error fetching image dimensions:', error);
    });

    // translateX.value = imgDimensions.width / 2;
    // translateY.value = imgDimensions.height / 2;
    
    //console.log("IMAGE URL: ", url);
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
  const size = useSharedValue(1);
  const newSize = useSharedValue(0);
  const currentangle = useSharedValue(0);
  const newAngle = useSharedValue(0);

  // useDerivedValue(() => {
  //   console.log(`X: ${translateX.value}, Y: ${translateY.value}`);
  // }, [translateX, translateY]);
  
  const pan = Gesture.Pan().minDistance(1)
    .onStart(() => {
      prevX.value = translateX.value;
      prevY.value = translateY.value;
    })
    .onUpdate((event) => {
      // translateX.value = prevX.value + event.translationX;
      // translateY.value = prevY.value + event.translationY;
      const xValue = prevX.value + event.translationX;
      const yValue = prevY.value + event.translationY;
      
      translateX.value = clamp(xValue, 0, imgViewDimensions.width - boxSize.width)
      translateY.value = clamp(yValue, -boxSize.height, imgViewDimensions.height - boxSize.height*2)
  }).runOnJS(true);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      newSize.value = size.value;
    })
    .onUpdate((event) => {
      size.value = newSize.value * event.scale;
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
      { scale: size.value }
    ],
  }));

  const composed = Gesture.Simultaneous(pan, pinch, rotation);

  const getViewInfo = (event: { nativeEvent: { layout: { width: any; height: any; x: any; y: any; }; }; }) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    const boxWidth = width * 0.3;
    const boxHeight = height * 0.3;

    setImgViewDimensions({ width: width, height: height, x: x, y: y });
    setBoxSize({width: boxWidth, height:boxHeight})
  };

  // const getViewInfo = (event) => {
  //   event.target.measure( (x, y, width, height, pageX, pageY) => {
  //     setImgViewDimensions({ width: width, height: height, x: pageX, y: pageY });
  //   });
  // };


  const printInfo = () => {
    console.clear()
    console.log("Image viewbox: ", imgViewDimensions)
    console.log("Image: ", imgDimensions)
    console.log("Bounding box: ", boxSize)
    console.log("X: ", translateX.value, "Y: ", translateY.value)
  };

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
                  {/* <Text>Height: {height}  ImgY: {imgDimensions.y}, ImgHeight: {imgDimensions.height}</Text> */}
                  {/* <Text>X: {translateX.value}  Y: {translateY.value}</Text> */}
                  <Image
                  source={{ uri: imgUrl }}
                  style={styles.image}
                  onLayout={getViewInfo}
                  />
                  {/* This is the actual bounding box which the user can resize */}
                  <Animated.View style={[animatedStyles, {width: boxSize.width, height: boxSize.height, borderColor:'yellow', borderWidth: 2, zIndex: 1, position: "absolute", top: boxSize.height} ]}/>
                  {/* <Animated.View style={[animatedStyles, {width: 100, height: 50, borderWidth: 1, borderColor: 'red', zIndex:1, position: 'absolute', top: 0}]}/> */}
                </View>
              </GestureDetector>
              </GestureHandlerRootView>
          </>
        ) : (
          <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
        )}
      {imgLoaded ? (
        <View>
          <Text>Angle: </Text>
          <TextInput keyboardType="numeric" value={angle} onChangeText={newAngle => onAngleChange(newAngle)} />
          <Text>Number of digits: </Text>
          <TextInput keyboardType="numeric" value={digits} onChangeText={newDigits => onChangeDigits(newDigits)} />
          <Text>Number of decimal places: </Text>
          <TextInput keyboardType="numeric" value={decimals} onChangeText={newDecimal => onChangeDecimals(newDecimal)} />
          <Text>Recognition result: {result}</Text>
          {/* Change onPress back to identify */}
          <Button title="Identify" onPress={printInfo} />
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
    alignItems: 'flex-start'
  },
  placeholder: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'stretch',
    width: '100%',
    // height: '10%',
    zIndex: -1,
    top: 0,
    borderColor: 'purple',
    borderWidth: 1
  },
  gestureHandler: {
    flex: 1,
    width: '100%'
  },
});
