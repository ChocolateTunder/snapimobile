import React from "react";
import { Button, Text, View, TextInput } from "react-native";
import CameraPage from "./camera";

export default function Index() {
    const [deviceID, onChangeDeviceID] = React.useState('');

    function submitCameraID(){
        console.log("Submit!");
    }

    

    return (
        <View
        style={{
            flex: 1,
            height: 100,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
        }}
        >   
            <View style={{
                flex: 0.6
            }}>
                <CameraPage/>
            </View>

            <TextInput
                onChangeText={onChangeDeviceID}
                value={deviceID}
                placeholder="Device ID"
            />
            <Button
                onPress={submitCameraID}
                title="Submit Device ID"
                color="green"
            />
        </View>
  );
}