import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import { Button, Platform, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';

export default function calibrate() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [flash, setFlash] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    // const [hasPermission, setHasPermission] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const { authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode, utilityPic, setUtilityPic, devicePic, setDevicePic } = useAppContext();
    const cameraRef = useRef(null)


    function toggleTorch(){
      setTorch(current => (current == false ? true : false));
    }
  
    function toggleFlash(){
      setFlash(current => (current == false ? true : false));
    }
  
    function toggleCameraFacing() {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const takePicture = async () => {
      if (cameraRef) {
        const photo = await cameraRef.current.takePictureAsync();
        setUtilityPic(photo.uri);
        setImageUri(photo.uri);
        console.log(cameraRef);
      }
    };
  
    const deletePicture = async () => {
      if (utilityPic) {
        await FileSystem.deleteAsync(utilityPic);
        setUtilityPic(null); // Clear the image URI
      }
    };

    // useEffect(() => {
    //   (async () => {
    //     const { status } = await Camera.requestCameraPermissionsAsync();
    //     setHasPermission(status === 'granted');
    //   })();
    // }, []);

    return (
        <View style={styles.container}>
          {!utilityPic ? (
            <>
            <CameraView style={styles.camera} facing={facing} enableTorch={torch} ref = {cameraRef}>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={toggleTorch}>
                  {torch ? <MaterialIcons name="flashlight-on" size={36} color="black" /> : <MaterialIcons name="flashlight-off" size={36} color="black" />}
                </Pressable>
                <Pressable style={styles.button} onPress={toggleCameraFacing}>
                  <MaterialIcons name="cameraswitch" size={36} color="black" />
                </Pressable>
                <Pressable style={styles.button} onPress={toggleFlash}>
                  {flash ? <MaterialIcons name="flash-on" size={36} color="black" /> : <MaterialIcons name="flash-off" size={36} color="black" />}
                </Pressable>
              </View>
              <View style={styles.buttonContainerBottom}>
                <Pressable style={styles.button} onPress={takePicture}>
                  <MaterialIcons name="camera" size={60} color="black"/>
                </Pressable>
              </View>
            </CameraView>
            </>
          ) : (
            <View>
              <Image source={{ uri: utilityPic }} />
              <Button title="Delete Picture" onPress={deletePicture} />
            </View>
          )}
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
      flexDirection: "column",
    },
    buttonContainer: {
      alignSelf: "center",
      justifyContent: "space-between",
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'rgba(84, 90, 96, 0.7)',
      marginTop: 15,   
      maxHeight: 40,
      maxWidth: 300,
      borderRadius: 10,
    },
    buttonContainerBottom: {
      position: "absolute",
      alignSelf: "center",
      bottom: 20,
      flexDirection: 'row',
      backgroundColor: 'rgba(84, 90, 96, 0.7)',
      borderRadius: 40,
      maxWidth: 60,
    },
    button: {
      flex: 1,
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
});