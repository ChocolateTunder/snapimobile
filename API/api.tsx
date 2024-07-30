import axios from 'axios';

const API_URL = 'https://api.snapi.com.au/gateway';
// process.env.EXPO_PUBLIC_TEMP_USERNAME
// process.env.EXPO_PUBLIC_TEMP_PASSWORD
let axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

export async function login() {
    const LOGIN_URL = API_URL + '/oauth/oauth/token';
    axios.post(LOGIN_URL, {
        username: process.env.EXPO_PUBLIC_TEMP_USERNAME,
        password: process.env.EXPO_PUBLIC_TEMP_PASSWORD,
        grant_type: "password"
        //refresh_token: "49eb10af-28ef-4679-85a6-5916aa5d092e",
        //grant_type: "refresh_token",
    }, axiosConfig)
    .then(function(response){
        console.log(response)
        return response.data.refresh_token;
    })
    .catch(function (error){
        console.error("Error in verifying login details: ", error);
    });
}

export function refresh(token:string){
    const LOGIN_URL = API_URL + '/oauth/oauth/token';
    axios.post(LOGIN_URL, {
        refresh_token: token,
        grant_type: "refresh_token"
    }, axiosConfig)
    .then(function(response){
        console.log(response)
    })
    .catch(function (error){
        console.error("Error in verifying token: ", error);
    });
}