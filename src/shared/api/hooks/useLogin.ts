import { useState } from 'react';
import { API_URL } from '../api-url';

interface AuthData {
    name?: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token?: string;
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
            console.log(result)

            if (!response.ok) {
                throw new Error(result.message || 'Помилка запиту');
                
            }

            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Щось пішло не так');
            console.log(err.message)
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};