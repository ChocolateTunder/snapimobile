import axios from 'axios';
import { ImageType } from 'expo-camera/build/legacy/Camera.types';

const API_URL = 'https://api.snapi.com.au/gateway';
const SNAPI_SERVER ='http://20.53.98.203';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

//TODO: CHANGE THE USERNAME AND PASSWORD TO BE FUNCTION PARAMETERS. A LOGIN PAGE WITH DESIRED SECURITY WILL NEED TO BE CREATED
//Uses stored env variable to login with QUT credentials. To log in create a .env file with the QUT username and password the fields in it.
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
}

//Refreshes the token when user navigates to new page
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

//Get the device details given device ID
export async function deviceDetails(token:string, device:number){
    const URL = API_URL + '/manage/v2/device/deviceName';
    // console.log("Device name: ", device, " Token: ", token)
    try {
        const response = await axios.get(URL, {params:
            {deviceName: device,
            access_token: token}
        })
        //console.log("API - Device details accessed", response.data)
        return response.data.data;
    } catch(error) {
        console.error("Error in getting device details: ", error);
        throw error;
    }
}

//Get most recently taken picture from the device
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
        //console.log("API - Picture info gotten");
        return response.data.data.list[0];
    } catch(error){
        console.error("Error in getting device picture: ", error);
        throw error;
    }
}

//Helper function for uploadCutoutPic, might need to convert image from base64 to binary but no luck, the website does submit png as binary in API call.
async function base64ToBlob(base64, mimeType = 'application/octet-stream') {
    const base64Data = base64.split(',')[1] || base64;
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Use fetch to get the Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return blob;
}

//TODO: CURRENTLY BEING REJECTED FOR NOT BEING RIGHT FORMAT, TRY GETTING THE BASE64 RESPONSE FROM CONFIG() TO BE BINARY PNG
//Uploads the cropped image from image_config/config so that the server can perform AI number detection on it
export async function uploadCutoutPic(image:string, access_token:string) {
    const URL = SNAPI_SERVER + '/gateway/manage/picture/uploadCutPic';
    const data = new FormData();

    // const byteCharacters = atob(image); // Decode the base64 string
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

    // // Append the image blob to the FormData
    // data.append('pic', imageBlob, 'image.jpg');
    data.append('pic', new Blob([image], { type: 'image/png' }));
    // const mimeType = "image/png";
    // const imageBlob = await base64ToBlob(image, mimeType);
    // base64ToBlob(image, mimeType).then(blob => {data.append('pic', blob, 'image.png');})
    
    // data.append('pic', `data:image/png;base64,${image}`);
    data.append('access_token', access_token);
    try {
        // axios.post(URL, data).then(function(response){
        //     console.log("API - Upload Successful", response.data.data)
        //     return response.data.data;
        // });
        const response = await axios.post(URL, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        console.log("Cutout: ", response.data.data)
        return response.data.data;
    }catch (error) {
        console.error("Error in uploading cutout pic: ", error);
    
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            // Request was made, but no response was received
            console.error("Request data:", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Error message:", error.message);
        }
    
        console.error("Axios config:", error.config);
    }
        
}

//Uploads selected image (in this case the most recent we loaded in) and the bounding box details to return a base64 representation of the cropped image
export async function config(imgPath:string, access_token:string, device:string, meterId:number, angle:number, centre_x:number, 
    centre_y:number, big_width:number, big_height:number, coords:number[] , digits:number, decimals:number, companyId:number, refresh_token:number) {
    const URL = SNAPI_SERVER + '/image_config/config';
    
    const payload = {
        source: "self",
        find_box_web: 1,
        is_config: 0,
        imageType: 1,
        meter_id: meterId,
        image_path: imgPath,
        deviceName: device,
        angle: angle,
        centre_x: centre_x,
        centre_y: centre_y,
        big_width: big_width,
        big_height: big_height,
        coord_list: coords,
        digitalNum: digits,
        decimal: decimals,
    };

    try {
        const response = await axios.post(URL, payload, {headers: { 
            'Content-Type': 'application/json', 
            'Cookies': 'companyId=${companyId}; token=${access_token}; userAuthority=isCompany; refresh_token=${refresh_token};networkTypeList=[{%22id%22:1%2C%22num%22:1%2C%22description%22:%22UDP%22%2C%22key%22:1}%2C{%22id%22:2%2C%22num%22:2%2C%22description%22:%22NBIOT%22%2C%22key%22:2}%2C{%22id%22:3%2C%22num%22:3%2C%22description%22:%22WIFI%22%2C%22key%22:3}%2C{%22id%22:4%2C%22num%22:4%2C%22description%22:%22ETHERNET%22%2C%22key%22:4}%2C{%22id%22:5%2C%22num%22:5%2C%22description%22:%22LORA%22%2C%22key%22:5}%2C{%22id%22:6%2C%22num%22:6%2C%22description%22:%222G%22%2C%22key%22:6}%2C{%22id%22:7%2C%22num%22:7%2C%22description%22:%223G%22%2C%22key%22:7}%2C{%22id%22:8%2C%22num%22:8%2C%22description%22:%224G%22%2C%22key%22:8}%2C{%22id%22:9%2C%22num%22:9%2C%22description%22:%22LIERDA_LORA%22%2C%22key%22:9}%2C{%22id%22:10%2C%22num%22:10%2C%22description%22:%225G%22%2C%22key%22:10}%2C{%22id%22:11%2C%22num%22:11%2C%22description%22:%22HUAWEI%22%2C%22key%22:11}%2C{%22id%22:12%2C%22num%22:12%2C%22description%22:%22LoRa_LinkWan%22%2C%22key%22:12}%2C{%22id%22:13%2C%22num%22:13%2C%22description%22:%22CHINA_TELECOM%22%2C%22key%22:13}];'
            },
            withCredentials: true})
        // console.log('Config:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('Error posting image config:', error);
    }
  }

  //TODO: deviceConfig 
  //TODO: updateOrGenerateData
  //TODO: deviceSet