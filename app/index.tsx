import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext, useEffect, useState } from "react";
import { Camera, CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, refresh } from '../API/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './context';
import { router } from 'expo-router';
//<MaterialIcons name="flashlight-on" size={24} color="black" />
//<MaterialIcons name="flashlight-off" size={24} color="black" />
//<MaterialIcons name="flash-on" size={24} color="black" />
//<MaterialIcons name="flash-off" size={24} color="black" />
//<MaterialIcons name="flash-auto" size={24} color="black" />
//<MaterialIcons name="cameraswitch" size={24} color="black" />
//<TouchableOpacity style={styles.button} onPress={toggleFlash}>
//{flash ? <MaterialIcons name="flash-on" size={24} color="black" /> : <MaterialIcons name="flash-off" size={24} color="black" />}
//</TouchableOpacity>
//            <View style={styles.shutterButton}>
//<MaterialIcons name="camera" size={75} color="black" />              
//</View>

//async function save(key, value) {
//  await SecureStore.setItemAsync(key, value);
//}
async function save(key, value) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value.toString());
    }
  } catch (error) {
    console.error("Error saving data:", error); 
  }
}

// async function getValueFor(key) {
//   const result = await SecureStore.getItemAsync(key);
//   if (result) {
//     console.log('Key found.');
//     return result;
//   } else {
//     console.log('No values stored under that key.');
//     return ' ';
//   }
// }

async function getValueFor(key) {
  try {
    if (Platform.OS === 'web') {
      const result = await AsyncStorage.getItem(key);
      if (result) {
        console.log('Key found.');
        return result;
      } else {
        console.log('No values stored under that key.');
        return ' ';
      }
    } else {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        console.log('Key found.');
        return result;
      } else {
        console.log('No values stored under that key.');
        return ' ';
      }
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
}


export default function Index() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode } = useAppContext();
  // const [accessToken, setAccessToken] = useContext(AppContext);
  // const [refreshToken, setRefreshToken] = useContext(AppContext);


  useEffect(() => {
    // (async () => {
    //   const key = await getValueFor(username);
    //   console.log("Key ", key)
    //   setToken(key);
    // });
    // const key = getValueFor(username);
    // console.log("Key ", key)
    // if (token == ' ') {
    //   try {
    //     (async () => {
    //       const token = await login();
    //     });
    //     setToken(token);
    //     save(username, token);
    //     console.log("Logged in! ", token);
    //   } catch (error) {
    //     console.log("Error logging in: ", error);
    //   }   
    // } else {
    //   refresh(token);
    // }
    async function getLoginDetails() {
      try {
          const loginDetails = await login();
          setAuthToken(loginDetails.access_token);
          setRefreshToken(loginDetails.refresh_token);
          
          // setTokens({
          //   accessToken: loginDetails.access_token,
          //   refreshToken: loginDetails.refresh_token
          // });
          //Access using authTokens.accessToken or authTokens.refreshToken
          // navigation.navigate('Home')
      } catch (error) {
          console.error("Error fetching login details: ", error);
      }
    }

    getLoginDetails()
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
      {scanned && <View style={styles.buttonContainer}><Pressable style={styles.button} onPress={resetScan}><Text>Scan Again</Text></Pressable></View> }
      <View style={styles.buttonContainer}><Pressable style={styles.button} onPress={testSkip}><Text>Go to Calibration</Text></Pressable></View>
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
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3, // Shadow on Android
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
    borderRadius: 5,
    backgroundColor: '#2980b9', // Vibrant button color
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3,
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
