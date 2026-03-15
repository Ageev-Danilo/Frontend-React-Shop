import { useState } from 'react';
import { API_URL } from '../api-url';
import { jwtDecode } from 'jwt-decode';

interface AuthData {
    name?: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token?: string;
    message?: string;
}

interface JwtPayload {
    id: number;
    iat?: number;
    exp?: number;
}

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AuthResponse | null>(null);

    const execute = async (endpoint: string, body: AuthData): Promise<AuthResponse | null> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result: AuthResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Помилка запиту');
            }

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('authToken', result.token);

                const decoded = jwtDecode<JwtPayload>(result.token);
                if (decoded.id) {
                    localStorage.setItem('user_id', String(decoded.id));
                    window.dispatchEvent(new Event('storage'));
                }
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