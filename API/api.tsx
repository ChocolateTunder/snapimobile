import axios from 'axios';

const API_URL = 'https://api.snapi.com.au/gateway';
// process.env.EXPO_PUBLIC_TEMP_USERNAME
// process.env.EXPO_PUBLIC_TEMP_PASSWORD
let axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
// import qs from 'qs';
// const data = { 'bar': 123 };
// const options = {
//   method: 'POST',
//   headers: { 'content-type': 'application/x-www-form-urlencoded' },
//   data: qs.stringify(data),
//   url,
// };
// axios(options);


export async function login(){
    const LOGIN_URL = API_URL + '/oauth/oauth/token';
    try {
        const response = await axios.post(LOGIN_URL, {
            username: process.env.EXPO_PUBLIC_TEMP_USERNAME,
            password: process.env.EXPO_PUBLIC_TEMP_PASSWORD,
            grant_type: "password"
        }, axiosConfig);
        return response.data;
    } catch (error) {
        console.error("Error in verifying login details: ", error);
        throw error;
    }
    // axios.post(LOGIN_URL, {
    //     username: process.env.EXPO_PUBLIC_TEMP_USERNAME,
    //     password: process.env.EXPO_PUBLIC_TEMP_PASSWORD,
    //     grant_type: "password"
    //     //refresh_token: "49eb10af-28ef-4679-85a6-5916aa5d092e",
    //     //grant_type: "refresh_token",
    // }, axiosConfig)
    // .then(function(response){
    //     //console.log("Logged in! ", response.data.refresh_token)
    //     return response.data;
    // })
    // .catch(function (error){
    //     console.error("Error in verifying login details: ", error);
    // });
}

export function refresh(token:string){
    const LOGIN_URL = API_URL + '/oauth/oauth/token';
    axios.post(LOGIN_URL, {
        refresh_token: token,
        grant_type: "refresh_token"
    }, axiosConfig)
    .then(function(response){
        console.log(response)
        return response.data.access_token;
    })
    .catch(function (error){
        console.error("Error in verifying token: ", error);
    });
}