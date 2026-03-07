import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';

export interface CartItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    media?: string;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

export const useGetCart = () => {
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/products-in-order/2`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }),
                    },
                });

                if (!response.ok) {
                    throw new Error('Помилка при завантаженні кошика');
                }

                const data = await response.json();
                setCart(data || { items: [], total: 0 });
            } catch (err: any) {
                console.error('Error fetching cart:', err);
                setError(err.message || 'Щось пішло не так');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    return { cart, isLoading, error };
};