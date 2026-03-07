import { useState } from 'react';
import { API_URL } from '../api-url';

interface ResetPasswordData {
    password: string;
    confirmPassword: string;
    token: string; 
}

interface ResetPasswordResponse {
    message?: string;
}

export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ResetPasswordResponse | null>(null);

    const execute = async (body: ResetPasswordData): Promise<ResetPasswordResponse | null> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${API_URL}/api/email/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result: ResetPasswordResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Помилка запиту');
            }

            setData(result);
            return result;
        } catch (err: any) {
            console.log(err.message)
            setError(err.message || 'Щось пішло не так');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};