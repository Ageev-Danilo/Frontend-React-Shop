import { useState } from 'react';
import { API_URL } from '../api-url';

interface AuthData {
    name?: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token?: string;
    userId?: number;
    id?: number;
    message?: string;
}

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AuthResponse | null>(null);

    const execute = async (endpoint: string, body: AuthData): Promise<AuthResponse | null> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result: AuthResponse = await response.json();
            console.log('Login response:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Помилка запиту');
            }

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('authToken', result.token);
            }
            const userId = result.userId ?? result.id;
            if (userId) {
                localStorage.setItem('userId', String(userId));
            }

            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Щось пішло не так');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};