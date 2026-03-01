import { useState } from 'react';
import { API_URL } from '../api-url';
import { DeliveryAddress } from './useGetDelivery';

type DeliveryUpdate = Omit<DeliveryAddress, 'id'>;

export const useUpdateDelivery = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<DeliveryAddress | null>(null);

    const execute = async (payload: DeliveryUpdate) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch(`${API_URL}/delivery/:id`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Помилка збереження');
            const result = await res.json();
            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Помилка збереження');
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};