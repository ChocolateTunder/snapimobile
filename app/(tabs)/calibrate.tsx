import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Button, SafeAreaView, useWindowDimensions } from "react-native";
import { useAppContext } from '../context';
import { deviceDetails, getPicture, uploadCutoutPic, config, initialConfig} from "@/API/api";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withClamp, withSpring, clamp } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from "react-native-gesture-handler";

const SNAPI_SERVER ='http://20.53.98.203';

export default function Calibrate() {
  const [decimals, onChangeDecimals] = useState(0);
  const [digits, onChangeDigits] = useState(0);
  const [result, onResultChange] = useState(0);
  const [imgPath, updateImagePath] = useState('');
  const [imgId, updateImageId] = useState(0);
  const [meterId, updateMeterId] = useState(0);
  const [tempImgPath, updateTempImgPath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgLoaded, onImgLoad] = useState(false);
  const [imgViewDimensions, setImgViewDimensions] = useState({width: 0, height: 0, x:0, y:0});
  const [imgDimensions, setImgDimensions] = useState({width: 0, height: 0});
  const [boxSize, setBoxSize] = useState({width: 0, height: 0}); 

  //Values for Animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevX = useSharedValue(0);
  const prevY = useSharedValue(0);
  const size = useSharedValue(1);
  const newSize = useSharedValue(0);
  const currentangle = useSharedValue(0);
  const newAngle = useSharedValue(0);

  const { authToken, qrCode, refreshToken } = useAppContext();
  const {height, width} = useWindowDimensions();

  //Get devuce details
  async function getProductKey() {
    try {
      const details = await deviceDetails(authToken, qrCode);
      return details.productKey;
    } catch (error) {
      throw error;
    }
  }

  //Get device details
  async function getDeviceConfigImage() {
    try {
      const product = await getProductKey();
      //console.log("Product key: ", product);
      const img = await getPicture(authToken, qrCode, product);
      updateImagePath(img.path);
      updateImageId(img.id);
      updateMeterId(img.meterId);
    } catch (error) {
      console.log("Error in getting device image");
    }
  }

  //Download most recent image and display it for cropping
  function loadImage() {
    onImgLoad(true);
    const url = SNAPI_SERVER + imgPath;
    setImgUrl(url);
    
    Image.getSize(url, (width, height) => {
      setImgDimensions({ width: width, height: height });
    }, (error) => {
      console.error('Error fetching image dimensions:', error);
    });
    //console.log("IMAGE URL: ", url);
  }

  //Gesture hander stuff begins
  const pan = Gesture.Pan().minDistance(1)
    .onStart(() => {
      prevX.value = translateX.value;
      prevY.value = translateY.value;
    })
    .onUpdate((event) => {
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

  const composed = Gesture.Simultaneous(pan, pinch, rotation);
  //Gesture handler stuff ends

  //Manipulate the Animated.View
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${currentangle.value}deg` },
      { scale: size.value }
    ],
  }));

  
  //Get box details based on Animated.View coordinates
  const getViewInfo = (event: { nativeEvent: { layout: { width: any; height: any; x: any; y: any; }; }; }) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    const boxWidth = width * 0.3;
    const boxHeight = height * 0.1;

    setImgViewDimensions({ width: width, height: height, x: x, y: y });
    setBoxSize({width: boxWidth, height:boxHeight})
  };

  //For testing
  // const printInfo = () => {
  //   console.clear()
  //   console.log("X: ", translateX.value, " Y: ", translateY.value+boxSize.height);
  //   console.log("Width: ", boxSize.width, " Height: ", boxSize.height)
  //   console.log("Image Width: ", imgDimensions.width, " Image height: ", imgDimensions.height);
  //   console.log("Angle: ", (currentangle.value%360 + 360)%360);
  // };


  //Update cropping details
  async function firstConfig(centerX: number, centerY: number, coords: number[]){
    const imagePath = SNAPI_SERVER + imgPath;
    const data = await config(imagePath, authToken, qrCode.toString(), meterId, currentangle.value, centerX, centerY, boxSize.width, boxSize.height, coords, digits, decimals, 21, parseInt(refreshToken));
    // console.log(data);
    return data;
  }

  //This uses the uploadCutoutImg API function to upload crop box details and image, and gets back a cropped image that's temporarily stored on SNAPI servers
  async function uploadCutout(image: string) {
    const temp = uploadCutoutPic(image, authToken);
    console.log(temp)
  }

  //Begins process of uploadCutout,  deviceConfig, updateOrGenerateData, and deviceSet
  async function identify() {
    const rad = currentangle.value * (Math.PI / 180);
    // const rad = 30 * (Math.PI / 180);
    // translateX.value = 25.11;
    // translateY.value = 7.15;
    // setBoxSize({width: 134, height: 34})
    const y0 = translateY.value + boxSize.height;
    const centerX = translateX.value + boxSize.width / 2;
    const centerY = translateY.value + boxSize.height / 2;

    
    const x1 = translateX.value;
    const y1 = y0;
    const x2 = translateX.value + (boxSize.width * Math.cos(rad));
    const y2 = y0 + (boxSize.width * Math.sin(rad));
    const x3 = translateX.value + (boxSize.width * Math.cos(rad)) - (boxSize.height * Math.sin(rad));
    const y3 = y0 + (boxSize.width * Math.sin(rad)) + (boxSize.height * Math.cos(rad));
    const x4 = translateX.value - (boxSize.height * Math.sin(rad));
    const y4 = y0 + (boxSize.height * Math.cos(rad));

    
    let coordinates = [{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}]
    const coords = [x1, y1, x2, y2, x3, y3, x4, y4];
    const imagePath = SNAPI_SERVER + imgPath;

    try {
      const path = await firstConfig(centerX, centerY, coords);

      // await uploadCutout(path.local_image_cut_base64_decode);
      await uploadCutout(path.small_image_cut_base64_decode);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //Get device details
  useEffect(() => {
    getDeviceConfigImage();
  });

  return (
    <SafeAreaView style={styles.container}>
        {imgLoaded ? (
          <>
              <GestureHandlerRootView style={styles.gestureHandler}>
              <GestureDetector gesture={composed}>
                <View style={styles.container}>
                  <Image
                  source={{ uri: imgUrl }}
                  style={styles.image}
                  onLayout={getViewInfo}
                  />
                  {/* This is the actual bounding box which the user can resize */}
                  <Animated.View style={[animatedStyles, {width: boxSize.width, height: boxSize.height, borderColor:'yellow', borderWidth: 2, zIndex: 1, position: "absolute", top: boxSize.height} ]}>
                    <View style={styles.triangle}/>
                  </Animated.View>
                </View>
              </GestureDetector>
              </GestureHandlerRootView>
          </>
        ) : (
          <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
        )}
      {imgLoaded ? (
        <View style={styles.metaInput}>
          <View style={styles.inputHandler}>
            <Text>Number of digits: </Text>
            <TextInput style={styles.input} keyboardType="numeric" value={digits.toString()} onChangeText={newDigits => onChangeDigits(parseInt(newDigits))} />
          </View>
          <View style={styles.inputHandler}>
            <Text>Number of decimal places: </Text>
            <TextInput style={styles.input} keyboardType="numeric" value={decimals.toString()} onChangeText={newDecimal => onChangeDecimals(parseInt(newDecimal))} />
          </View>
          
          <Text style={styles.inputHandler}>Recognition result: {result}</Text>
          <Button title="Identify" onPress={identify} />
        </View>
      ) : (
        <Button title="Load Config" onPress={loadImage} />
      )}
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  metaInput: {
    flexDirection: 'column',
    alignSelf: 'center'
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    minWidth: '20%',
  },
  inputHandler: {
    flexDirection: "row",
  },
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
  },
  gestureHandler: {
    flex: 1,
    width: '100%'
  },
  topIndicator:{
    width: 2,
    height: 6,
    backgroundColor: "red",
    position: "absolute",
    top: -4,
    left: "50%"
  },
  triangle: {
    position: "absolute",
    top: -7,
    left: "50%",
    marginLeft: -5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'yellow',
    borderLeftColor: 'transparent',
  },
});
