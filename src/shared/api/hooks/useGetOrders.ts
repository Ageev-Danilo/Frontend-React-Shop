import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { AUTH_ERROR_MSG, getUserId, handleAuthError } from './auth.utils';

export interface OrderItem {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;  
    quantity: number;
    media?: string;
}

export interface Recipient {
    name: string;
    phone: string;
}

export interface Order {
    id: number;
    status: string;
    total: number;
    totalAmount?: number;
    createdAt: string;
    date?: string;
    orderNumber?: string;
    trackingNumber?: string | null;

    recipient?: Recipient;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;

    deliveryType?: string;   // 'warehouse' | 'postomат' | 'express' | 'courier'
    city?: string;
    warehouse?: string;
    street?: string;
    building?: string;
    apartment?: string;

    paymentMethod?: string;  // 'cash' | 'online' | 'card' | 'privat' | 'apple' | 'google'

    items: OrderItem[];
}

export const useGetOrders = () => {
    const [orders, setOrders]   = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

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