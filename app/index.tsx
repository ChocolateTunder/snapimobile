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
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: "center",
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(84, 90, 96, 0.7)',
    marginTop: 15,   
    maxHeight: 30,
    maxWidth: 300,
    borderRadius: 10,
  },
  shutterButton: {
    alignSelf: "center",
    bottom: 35,
    position: "absolute",
    backgroundColor: 'rgba(84, 90, 96, 0.7)',
    borderRadius: 40,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});