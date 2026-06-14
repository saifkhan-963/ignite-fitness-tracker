import axios from 'axios';
import { API_URL } from '../../data/variables';
import { showSuccess, showError } from '../components/elements/SwalAlert';

export const authservice = () => {
    const register = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/register/`, data);
            showSuccess('Registration successful');
            return response.data;
        } catch (error) {
            showError(error.response.data.detail || 'Registration failed');
            throw error;
        }
    };

    const login = async (data) => {
        try {
            console.log('api url', API_URL);
            const response = await axios.post(`${API_URL}/login/`, data);
            const token = JSON.stringify(response.data);
            localStorage.setItem('ag_auth_token', token);
            if (data.remember) {
                localStorage.setItem('ag_auth_remember', true);
            } else {
                localStorage.removeItem('ag_auth_remember');
            }
            showSuccess('Login successful');
            return response.data;
        } catch (error) {
            showError(error.response.data.non_field_errors || 'Login failed');
            throw error;
        }
    };

    const getAuthHeader = () => {
        const token = JSON.parse(localStorage.getItem('ag_auth_token'));
        return token && token?.access ? {  Authorization: `Bearer ${token.access}`  } : {};
    }

    const logout = () => {
        localStorage.removeItem('ag_auth_token');
        localStorage.removeItem('ag_auth_remember');
    }

    const refreshToken = async () => {
        const token = JSON.parse(localStorage.getItem('ag_auth_token'));
        if (token && token?.refresh) {
            try {
                const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: token.refresh });
                const newToken = { ...token, access: response.data.access };
                localStorage.setItem('ag_auth_token', JSON.stringify(newToken));
                return newToken;
            } catch (error) {
                console.error('Token refresh failed', error);
                throw error;
            }
        }
    }
        

    return {
        register,
        login,
        getAuthHeader,
        logout,
        refreshToken
    };
};