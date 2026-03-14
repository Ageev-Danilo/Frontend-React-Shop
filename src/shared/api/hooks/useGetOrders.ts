import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { getUserId, handleAuthError, AUTH_ERROR_MSG } from './auth.utils';

export interface Order {
    id: number;
    userId: number;
    payment?: string | null;      
    comment?: string | null;
    totalPrice?: number | null;    
    deliveryStatus: string;       

    createdAt?: string;
    orderNumber?: string;
    trackingNumber?: string | null;
}

export const useGetOrders = () => {
    const [orders, setOrders]       = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]         = useState<string | null>(null);

    const fetchOrders = async () => {
        const userId = getUserId();
        if (!userId) {
            setError(AUTH_ERROR_MSG);
            setOrders([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/orders/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.status === 401 || res.status === 403) {
                handleAuthError(res.status);
                setError(AUTH_ERROR_MSG);
                setOrders([]);
                return;
            }

            if (!res.ok) throw new Error(`Помилка ${res.status}`);

            const data: Order[] = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Невідома помилка');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, isLoading, error, refetch: fetchOrders };
};