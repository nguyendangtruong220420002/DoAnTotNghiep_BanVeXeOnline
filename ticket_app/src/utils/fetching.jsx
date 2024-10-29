import axios from 'axios';
import { getAsyncStorage } from './cookie';

// Tạo một instance của axios để tái sử dụng
// API Host
const host = '192.168.1.112';

// Server Port
const port = '5000';


// Base Url
export const BASE_URL = `http://${host}:${port}/api`;

// API api
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});


// Add an interceptor to set the token in the request headers
api.interceptors.request.use(async (config) => {
    const token = await getAsyncStorage('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; 
}, (error) => {
    return Promise.reject(error);
});



// Phương thức GET
export const getData = async (url, params = {}) => {
    try {
        const response = await axios.get(url, { params });
        return response;
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
};

// Phương thức POST
export const postData = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

// Phương thức PUT
export const putData = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response;
    } catch (error) {
        console.error('PUT request error:', error);
        throw error;
    }
};

// Phương thức DELETE
export const deleteData = async (url) => {
    try {
        const response = await api.delete(url);
        return response;
    } catch (error) {
        console.error('DELETE request error:', error);
        throw error;
    }
};

// Phương thức PATCH (update một phần dữ liệu)
export const patchData = async (url, data) => {
    try {
        const response = await api.patch(url, data);
        return response;
    } catch (error) {
        console.error('PATCH request error:', error);
        throw error;
    }
};

