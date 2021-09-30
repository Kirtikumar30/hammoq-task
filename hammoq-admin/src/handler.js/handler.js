import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Constant } from '../service/constant'



export const handler = {
    Post, Get
};

function Post(URL, Parameter) {
    var Token = localStorage.getItem(Constant.HAMMOQ_JWT_TOKEN);
    return axios.post(URL, Parameter, {
        headers: { 'Authorization': Token }
    }).then(response => {
        if (!response.statusText === "OK") {
            const error = response.statusText;
            return Promise.reject(error);
        }
        return response.data
    })
}
function Get(URL) {
    var Token = localStorage.getItem(Constant.HAMMOQ_JWT_TOKEN);
    return axios.get(URL, {
        headers: { 'Authorization': Token }
    }).then(response => {
        if (!response.statusText === "OK") {
            const error = response.statusText;
            return Promise.reject(error);
        }
        return response.data
    })
}
