import axios from 'axios';
import qs from 'qs';
import { USERNAME, PASSWORD } from '@env';
const baseUrl = 'https://api.snapi.com.au';

export const getToken=()=>{
    const tokenURL = '/oauth/oauth/token';
    const url = baseUrl + tokenURL;
    const data = {'username': USERNAME, 'password': PASSWORD, 'grant_type': 'password'};
    
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url,
    };
    const post = url + qs.stringify(data);
    console.log({post});
    axios(options).then(response => {console.log(response)}).catch(error => {console.error("Error: ", error)});
}

export const checkDeviceExists=()=>{
    const deviceExistsURL = '';
}