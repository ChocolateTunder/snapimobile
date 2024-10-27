//This is the QR Code Scanning screen

import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext, useEffect, useState } from "react";
import { Camera, CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { login, refresh } from '../API/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './context';
import { router } from 'expo-router';

export default function Index() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode } = useAppContext();

//TODO: REMOVE THIS FOR A REAL LOGIN PAGE, CAN ADD USEEFFECT() TO AUTOLOGIN IF REFRESH TOKEN ISN'T TIMED OUT FOR CONVENIENCE
//This is the automatic login function when page loads
  useEffect(() => {
    async function getLoginDetails() {
      try {
          const loginDetails = await login();
          setAuthToken(loginDetails.access_token);
          setRefreshToken(loginDetails.refresh_token);
      } catch (error) {
          console.error("Error fetching login details: ", error);
      }
    }

    getLoginDetails();
  }, []);
  

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleTorch(){
    setTorch(current => (current == false ? true : false));
  }

  function toggleFlash(){
    setFlash(current => (current == false ? true : false));
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    //alert(`Bar code with data ${result.data} has been scanned!`);
    //TODO: MOVE TO NEXT PAGE
    //navigation.navigate('(tabs)', {result});
    setQRCode(data);
    router.push({pathname: '/(tabs)/' });
  };

  function testSkip(){
    setQRCode(866207059655070);
    router.push({pathname: '/(tabs)/' });
  }

  function resetScan(){
    setScanned(false);
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} enableTorch={torch} barcodeScannerSettings={{barcodeTypes: ["qr"]}} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleTorch}>
            {torch ? <MaterialIcons name="flashlight-on" size={24} color="black" /> : <MaterialIcons name="flashlight-off" size={24} color="black" />}
          </Pressable>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="cameraswitch" size={24} color="black" />
          </Pressable>
        </View>
      </CameraView>
      {/* If for some reason the use is not navigated away and the scanned flag is already set, this will reset it */}
      {/* {scanned && <View style={styles.buttonContainer}><Pressable style={styles.button} onPress={resetScan}><Text>Scan Again</Text></Pressable></View> } */}
      {/* If you need to test and don't want to point phone at QR code, this uses the device number in testSkip */}
      {/* <View style={styles.buttonContainer}><Pressable style={styles.button} onPress={testSkip}><Text>Go to Calibration</Text></Pressable></View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2C3E50', // Sleek dark background
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
    color: '#ecf0f1', // Light text color for contrast
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: "center",
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 62, 80, 0.8)', // Semi-transparent dark color
    marginTop: 15,   
    maxHeight: 50, // Slightly larger for better interaction
    maxWidth: 350,
    borderRadius: 20, // More rounded for a smooth look
  },
  shutterButton: {
    alignSelf: "center",
    bottom: 40,
    position: "absolute",
    backgroundColor: 'linear-gradient(135deg, #16a085, #f4d03f)', // Gradient for cool effect
    borderRadius: 50,
    width: 70,
    height: 70, // Larger button with circular shape
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a085', // Matching shadow for gradient
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5, // Enhanced shadow on Android
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 26, // Slightly larger for emphasis
    fontWeight: 'bold',
    color: '#ecf0f1', // Light text color
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for a fancy effect
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     alignSelf: "center",
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'rgba(84, 90, 96, 0.7)',
//     marginTop: 15,   
//     maxHeight: 30,
//     maxWidth: 300,
//     borderRadius: 10,
//   },
//   shutterButton: {
//     alignSelf: "center",
//     bottom: 35,
//     position: "absolute",
//     backgroundColor: 'rgba(84, 90, 96, 0.7)',
//     borderRadius: 40,
//   },
//   button: {
//     flex: 1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });