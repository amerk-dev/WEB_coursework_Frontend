import { createContext, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/api/auth/token/', { username, password });
            localStorage.setItem('token', response.data.access);
            setToken(response.data.access);
        } catch (error) {
            throw new Error('Ошибка авторизации');
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await api.post('/api/auth/register/', { username, email, password });
        } catch (error) {
            throw new Error('Ошибка регистрации');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);