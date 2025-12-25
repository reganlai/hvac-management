import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.7.240:3001/api'; // Local network IP


const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
};

export const userApi = {
    getProfile: () => api.get('/auth/profile'),
    createTechnician: (userData: any) => api.post('/users', userData),
};

export const quoteApi = {
    createQuote: (quoteData: any) => api.post('/quotes', quoteData),
    addPart: (quoteId: string, partData: any) => api.post(`/quotes/${quoteId}/parts`, partData),
    addLabor: (quoteId: string, laborData: any) => api.post(`/quotes/${quoteId}/labor`, laborData),
    addFee: (quoteId: string, feeData: any) => api.post(`/quotes/${quoteId}/fees`, feeData),
    signQuote: (quoteId: string, signature: string) => api.post(`/quotes/${quoteId}/sign`, { signature }),
};

export default api;
