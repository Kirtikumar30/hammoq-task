import axios from 'axios';
import { BASE_URL, environment } from '../environment/environment';
import 'react-toastify/dist/ReactToastify.css';
import { Constant } from './constant';
import { handler } from "../handler.js/handler"


export const UserService = {
    register,
    login, getUseById, loginWithGoogle,
    updateUseById, getAllUser,
    updateUsePhotoById
};


function register(data) {
    var url = BASE_URL + environment.USER_REGISTER;
    return handler.Post(url, data).then(res => {
        return res
    })
}
function login(data) {
    var url = BASE_URL + environment.USER_LOGIN;
    return handler.Post(url, data).then(res => {
        return res
    })
}
function loginWithGoogle(data) {
    var url = BASE_URL + environment.USER_LOGIN_GOOGLE;

    return axios.post(url, data).then(response => {
        if (!response.statusText === "OK") {
            const error = response.statusText;
            return Promise.reject(error);
        }
        return response.data
    })
}
function getUseById(id) {
    var url = BASE_URL + environment.GET_USER_DATA_BY_ID + id;
    return handler.Get(url).then(res => {
        return res
    })
}
function updateUseById(data, id) {
    var url = BASE_URL + environment.UPDATE_USER + id;
    return handler.Post(url, data).then(res => {
        return res
    })
}
function updateUsePhotoById(data, id) {
    var url = BASE_URL + environment.UPLOAD_USER_PROFILE_IMG + id;
    const formData = new FormData();
    formData.append('photo', data)
    return handler.Post(url, formData).then(res => {
        return res
    })
}
function getAllUser() {
    var url = BASE_URL + environment.GET_ALL_USER;
    return handler.Get(url).then(res => {
        return res
    })
}
