import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Image, Button } from "react-native";
import { useAppContext } from '../context';
import { deviceDetails, getPicture, uploadCutoutPic } from "@/API/api";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function calibrate() {
    const [decimals, onChangeDecimals] = useState('');
    const [digits, onChangeDigits] = useState('');
    const [meterID, onChangeMeterID] = useState(1800);
    const [angle, onAngleChange] = useState('');
    const [result, onResultChange] = useState(0);
    const [imgPath, updateImagePath] = useState('');
    const [tempImgPath, updateTempImgPath] = useState('');
    const [imgLoaded, onImgLoad] = useState(false);
    const { authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode } = useAppContext();

    async function getProductKey(){
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
      } catch(error){
        console.log("Error in getting device image")
      }
    }

    function convertToBase64(url:string){
      fetch(url).then(response => response.blob()).then(blob => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        return new Promise ((response) => {
          fileReader.onloadend = () => {
            response(fileReader.result?.toString); 
        }})
      })
      return 'Calibration Error';
    }

    async function createCutout(imagePath:string, token:string){
      try {
        const img64:string = convertToBase64(imagePath);
        const path = await uploadCutoutPic(img64, token);
        updateTempImgPath(path);
        console.log("Temp img path: ", tempImgPath);
      } catch (error) {
        
      }      
    }

    function loadImage(){
      onImgLoad(true)
    }

    function identify(){
      createCutout(imgPath, authToken);
    }
  
    useEffect(() =>{
      getDeviceConfigImage();    
    }, [])

  return (
    <View style={styles.container}>
      {imgLoaded ? (
        <Image
          source={{ uri: "http://20.53.98.203" + imgPath }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.placeholder}>Press the button to get the latest image from SNAPI device</Text>
      )}

      {imgLoaded ? (
        <View>
          <Text>Angle:                    </Text><TextInput keyboardType="numeric" value={angle} onChangeText={newAngle => onAngleChange(newAngle)}/>
          <Text>Number of digits:         </Text><TextInput keyboardType="numeric" value={digits} onChangeText={newDigits => onChangeDigits(newDigits)}/>
          <Text>Number of decimal places: </Text><TextInput keyboardType="numeric" value={decimals} onChangeText={newDecimal => onChangeDecimals(newDecimal)}/>
          <Text>Recognition result: {result}</Text>
          <Button title="Identify" onPress={identify}/>
        </View>
      ) : (
        <Button title="Load Config" onPress={loadImage}/>
      )}
    </View>
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    borderColor: "black",
    borderWidth: 2
  }
});