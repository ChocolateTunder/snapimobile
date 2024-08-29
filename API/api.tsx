import axios from 'axios';

const API_URL = 'https://api.snapi.com.au/gateway';
const SNAPI_SERVER ='http://20.53.98.203';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

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
    .catch(function(error){
        console.error("Error in verifying token: ", error);
    });
}

export async function deviceDetails(token:string, device:number){
    const URL = API_URL + '/manage/v2/device/deviceName';

    try {
        const response = await axios.get(URL, {params:
            {deviceName: device,
            access_token: token}
        })
        console.log("API - Device details accessed", response.data)
        return response.data.data;
    } catch(error) {
        console.error("Error in getting device details: ", error);
        throw error;
    }
}


export async function getPicture(token:string, device:number, product:string){
    const IMAGE_URL = API_URL + '/manage/picture/lastedPicture';
    try {
        const response = await axios.get(IMAGE_URL, {params:
            {currentPage: 1,
            pageSize: 1,
            deviceName: device,
            picMode: 2,
            productKey: product,
            access_token: token}
        })
        console.log("API - Picture info gotten");
        return response.data.data.list[0].path;
    } catch(error){
        console.error("Error in getting device picture: ", error);
        throw error;
    }
}
export async function uploadCutoutPic(img64:string, access_token:string) {
    const URL = SNAPI_SERVER + '/gateway/manage/picture/uploadCutPic';
    const data = new FormData();
    data.append('pic', new Blob([img64], { type: 'image/jpg' }));
    data.append('access_token', access_token);
    
    try {
        axios.post(URL, data).then(function(response){
            console.log("API - Upload Successful", response)
            return response.data.data;
        });
    } catch (error) {
        console.error("Error in getting device picture: ", error);
        throw error;
    }

    return 'API Error';
}