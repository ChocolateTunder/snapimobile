import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from "react";
import { Camera, CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, refresh } from '../API/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
const username = 'default';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log('Key found.');
    return result;
  } else {
    console.log('No values stored under that key.');
    return ' ';
  }
}

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [token, setToken] = useState(' ');

  useEffect(() => {
    (async () => {
      const key = await getValueFor(username);
      console.log("Key ", key)
      setToken(key);
    });

    if (token == ' ') {
      try {
        (async () => {
          const token = await login();
        });
        setToken(token);
        save(username, token);
        console.log("Logged in!");
      } catch (error) {
        console.log("Error logging in: ", error);
      }   
    } else {
      refresh(token);
    }
     
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

  function handleOnBarcodeScanned(result: BarcodeScanningResult){
    setScanned(true);
    alert(`Bar code with data ${result} has been scanned!`);
  } 

    function resetScan(){
      setScanned(false);
    }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} enableTorch={torch} barcodeScannerSettings={{barcodeTypes: ["qr"]}} onBarcodeScanned={scanned ? undefined: handleOnBarcodeScanned}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleTorch}>
            {torch ? <MaterialIcons name="flashlight-on" size={24} color="black" /> : <MaterialIcons name="flashlight-off" size={24} color="black" />}
          </Pressable>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="cameraswitch" size={24} color="black" />
          </Pressable>
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={resetScan}>
          <Text>Scan Again</Text>
        </Pressable>
      </View>
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