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

export const useGetDelivery = () => {
    const [delivery, setDelivery] = useState<DeliveryAddress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/user/delivery`, {
                    credentials: 'include',
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