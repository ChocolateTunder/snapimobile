import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { useAuth } from "../context";
import { MaterialIcons } from "@expo/vector-icons";

export default function calibrate() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [flash, setFlash] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    
  
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
    return (
        <View style={styles.container}>
          <CameraView style={styles.camera} facing={facing} enableTorch={torch}>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={toggleTorch}>
                {torch ? <MaterialIcons name="flashlight-on" size={24} color="black" /> : <MaterialIcons name="flashlight-off" size={24} color="black" />}
              </Pressable>
              <Pressable style={styles.button} onPress={toggleCameraFacing}>
                <MaterialIcons name="cameraswitch" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.button} onPress={toggleFlash}>
                {flash ? <MaterialIcons name="flash-on" size={24} color="black" /> : <MaterialIcons name="flash-off" size={24} color="black" />}
              </Pressable>
            </View>
          </CameraView>
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