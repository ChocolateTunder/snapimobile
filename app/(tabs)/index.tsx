import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { MaterialIcons } from "@expo/vector-icons";

export default function calibrate() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [flash, setFlash] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const { authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode } = useAppContext();
  
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
    backgroundColor: '#2C3E50', // Dark background for a sleek, modern look
    paddingHorizontal: 20, // Added horizontal padding for better spacing
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
    color: '#ecf0f1', // Light color for good contrast
    fontWeight: '600', // Semi-bold for emphasis
    letterSpacing: 0.5, // Slight letter spacing for modern readability
    marginTop: 20, // Adds space above the message
  },
  camera: {
    flex: 1,
    borderRadius: 10, // Smooth edges for modern look
    overflow: 'hidden', // Ensures child elements like buttons stay within rounded corners
    marginBottom: 20, // Adds space below the camera view
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 62, 80, 0.9)', // Dark transparent background for buttons
    paddingVertical: 10, // Padding for better button touch target
    paddingHorizontal: 15, // Horizontal padding for cleaner spacing
    borderRadius: 20, // Rounded corners for modern aesthetic
    shadowColor: '#000', // Shadow for depth effect
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4, // Shadow on Android
    marginTop: 20, // Adds space above the button container
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12, // Padding for better touch target
    paddingHorizontal: 20, // Horizontal padding for better spacing
    borderRadius: 10, // Smooth edges for a polished look
    backgroundColor: '#2980b9', // Vibrant blue color for buttons
    marginHorizontal: 8, // Spacing between buttons
    shadowColor: '#000', // Shadow for depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 3, // Elevation for Android shadow
  },
  shutterButton: {
    position: 'absolute',
    bottom: 40, // Positioning the shutter button above the bottom edge
    alignSelf: 'center',
    width: 80,
    height: 80, // Larger button for better interaction
    borderRadius: 50, // Fully rounded button for a modern look
    backgroundColor: 'linear-gradient(135deg, #16a085, #f4d03f)', // Gradient for cool, modern effect
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a085', // Matching shadow for gradient
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5, // Elevation for Android shadow
  },
  text: {
    fontSize: 26, // Larger text for better emphasis
    fontWeight: 'bold',
    color: '#ecf0f1', // Light text color for contrast
    textAlign: 'center', // Centered for balance
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5, // Smooth shadow effect
    marginTop: 20, // Adds space above the text
  },
});
