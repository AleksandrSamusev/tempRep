import axios from 'axios';
import { API_V1_URL } from '@/config/apiConfig';

const apiClient = axios.create({
    baseURL: API_V1_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;