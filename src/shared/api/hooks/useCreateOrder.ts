import { useState } from 'react';
import { API_URL } from '../api-url';
import { getUserId, getToken } from './auth.utils';

export interface CreateOrderData {
    firstName: string;
    lastName: string;
    patronymic: string;
    phone: string;
    email: string;
    comment?: string;
}

export interface CreateOrderResponse {
    orderId: number;
    orderNumber: string;
    message?: string;
}

export const useCreateOrder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (data: CreateOrderData): Promise<CreateOrderResponse | null> => {
        const userId = getUserId();
        if (!userId) {
            setError('Будь ласка, увійдіть в акаунт');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/orders/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify(data),
            });

            const result: CreateOrderResponse = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Помилка при створенні замовлення');
            }
            return result;
        } catch (err: any) {
            setError(err.message || 'Щось пішло не так');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error };
};