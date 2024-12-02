import axios from 'axios';
import { DEV_API_URL, PROD_API_URL } from '../constants';
import StorageService from './StorageService';

const api = axios.create({
    baseURL: PROD_API_URL,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await StorageService.getValue('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error retrieving token', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const ApiService = {
    login: async (userData) => (await api.post('/login', userData)).data,
    createUser: async (userData) => (await api.post('/users', userData)).data,
    verifyOTP: async (userId, code) => (await api.post(`/verify/${userId}`, { otp: code })).data,
    profileSetup: async (profileData) => (await api.post('/profile-setup', profileData)).data,
    addNotes: async (noteData) => (await api.post('/users/notes', noteData)).data,
};

export default ApiService;