import { useState } from 'react';
import { API_URL } from '../api-url';

interface AddToCartPayload {
    productId: number;
    quantity: number;
}

interface AddToCartResult {
    success: boolean;
    message?: string;
}

function getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const id = Number(raw);
    return isNaN(id) ? null : id;
}

export const useAddToCart = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (payload: AddToCartPayload): Promise<AddToCartResult | null> => {
        const userId = getUserId();
        if (!userId) {
            setError('Будь ласка, увійдіть в акаунт');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/products-in-order/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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