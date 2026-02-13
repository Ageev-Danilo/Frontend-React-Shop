import { useState } from 'react';

const BASE_URL = 'http://localhost:8000/api'; 

export const useAuthRequest = (endpoint: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const sendRequest = async (formData: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Щось пішло не так');
            }

            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { sendRequest, isLoading, error, data };
};