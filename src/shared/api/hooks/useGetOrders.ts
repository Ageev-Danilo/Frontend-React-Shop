import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { getUserId } from './auth.utils';

export interface OrderItem {
    id: number;
    name: string;
    price: number;
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
    items: OrderItem[];
}

export const useGetOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        const userId = getUserId();
        if (!userId) {
            setError('Будь ласка, увійдіть в акаунт');
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