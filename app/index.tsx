import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const token_url = "https://api.snapi.com.au/gateway/oauth/oauth/token";

export default function Index() {
    const [token, setToken] = useState(" ");
    //setToken("Test");

    /*
    Refresh token is stored in token, check for cached version using SecureStore and set token to anything found using SecureStore
    If that token is accepted the .then function should lead user to home page
    If the token is not accepted the .catch takes the user to the login page
    */
    useEffect(() => {
        let payload = {
            refresh_token: token,
            grant_type: "refresh_token",
        }
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post(token_url, payload, axiosConfig)
        .then(function(response){
            console.log(response)
        })
        .catch(function (error){
            console.error("Error in verifying token: ", error);
        });
    }, []);

    <View>
        <Text>
            Test
        </Text>
    </View>
}