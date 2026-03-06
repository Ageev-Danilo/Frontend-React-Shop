import { useState } from 'react';
import { API_URL } from '../api-url';

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
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/orders`, {
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
            const errorMsg = err.message || 'Щось пішло не так';
            setError(errorMsg);
            console.error('Error creating order:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error };
};