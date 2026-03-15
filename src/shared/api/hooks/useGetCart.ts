import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { getUserId, handleAuthError, AUTH_ERROR_MSG } from './auth.utils';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    media?: string;
}

interface Cart {
    items: CartItem[];
    total: number;
}

interface RawProductOnOrder {
    id: number;
    orderId: number;
    productId: number;
    count: number;
    product: {
        id: number;
        name: string;
        price: number;
        oldPrice?: number;
        media?: string;
        imageUrl?: string;
    };
}

function transformCart(raw: RawProductOnOrder[]): Cart {
    const items: CartItem[] = raw.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.count,
        media: item.product.media ?? item.product.imageUrl,
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, total };
}

export const useGetCart = () => {
    const [cart, setCart]           = useState<Cart>({ items: [], total: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]         = useState<string | null>(null);

    const fetchCart = async () => {
        const userId = getUserId();
        if (!userId) {
            setError(AUTH_ERROR_MSG);
            setCart({ items: [], total: 0 });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/products-in-order/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.status === 401 || res.status === 403) {
                handleAuthError(res.status);
                setError(AUTH_ERROR_MSG);
                setCart({ items: [], total: 0 });
                return;
            }

            if (!res.ok) throw new Error(`Помилка ${res.status}`);

            const raw: RawProductOnOrder[] = await res.json();
            setCart(transformCart(raw));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Невідома помилка');
            setCart({ items: [], total: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
        const handleStorage = () => fetchCart();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return { cart, isLoading, error, refetch: fetchCart };
};