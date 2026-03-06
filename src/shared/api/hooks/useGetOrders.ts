import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    media?: string;
}

interface Order {
    id: number;
    orderNumber: string;
    date: string;
    status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'completed';
    totalAmount: number;
    trackingNumber?: string;
    deliveryAddress: {
        city: string;
        street: string;
        building: string;
        apartment?: string;
        entrance?: string;
    };
    recipient: {
        name: string;
        phone: string;
    };
    items: OrderItem[];
}

export const useGetOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Помилка при завантаженні замовлень');
                }

                const data = await response.json();
                setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Щось пішло не так');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { orders, isLoading, error };
};