import { useState } from 'react';
import { API_URL } from '../api-url';

interface ForgotPasswordData {
    email: string;
}

interface ForgotPasswordResponse {
    message?: string;
}

export const useForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ForgotPasswordResponse | null>(null);

    const execute = async (body: ForgotPasswordData): Promise<ForgotPasswordResponse | null> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`${API_URL}/email/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result: ForgotPasswordResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Помилка запиту');
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