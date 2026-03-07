import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';

export interface DeliveryAddress {
    id: number;
    city: string;
    street: string;
    building: string;
    apartment: string;
    entrance: string;
}

function getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const id = Number(raw);
    return isNaN(id) ? null : id;
}

export const useGetDelivery = () => {
    const [delivery, setDelivery] = useState<DeliveryAddress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDelivery = async () => {
            const userId = getUserId();
            if (!userId) {
                setError('Будь ласка, увійдіть в акаунт');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/delivery/${userId}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Помилка завантаження');
                const data = await res.json();
                setDelivery(data);
            } catch (err: any) {
                setError(err.message || 'Помилка завантаження');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDelivery();
    }, []);

    return { delivery, isLoading, error };
};