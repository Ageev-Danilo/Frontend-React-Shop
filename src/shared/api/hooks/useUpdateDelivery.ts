import { useState } from 'react';
import { API_URL } from '../api-url';
import { getUserId } from './auth.utils';
import { DeliveryAddress } from './useGetDelivery';

type DeliveryUpdate = Omit<DeliveryAddress, 'id'>;

export const useUpdateDelivery = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<DeliveryAddress | null>(null);

    const execute = async (payload: DeliveryUpdate) => {
        const userId = getUserId();
        if (!userId) {
            setError('Будь ласка, увійдіть в акаунт');
            return null;
        }

        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch(`${API_URL}/delivery/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Помилка збереження');
            const result = await res.json();
            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Помилка збереження');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};