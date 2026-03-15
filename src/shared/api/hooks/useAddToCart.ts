import { useState } from 'react';
import { API_URL } from '../api-url';
import { getUserId, AUTH_ERROR_MSG } from './auth.utils';

interface AddToCartPayload {
    productId: number;
    count: number; 
}

interface AddToCartResult {
    message: string;
}

export const useAddToCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (productId: number, count: number = 1): Promise<AddToCartResult | null> => {
        const userId = getUserId();
        if (!userId) {
            setError(AUTH_ERROR_MSG);
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/products-in-order/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, count }),
            });
            if (!res.ok) throw new Error(`Помилка ${res.status}`);
            const data: AddToCartResult = await res.json();
            return data;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Невідома помилка';
            setError(msg);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error };
};