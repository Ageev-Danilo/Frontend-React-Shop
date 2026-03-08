import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';

interface CartItem {
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

function getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (!raw) return null;
    const id = Number(raw);
    return isNaN(id) ? null : id;
}

export const useGetCart = () => {
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        const userId = getUserId();
        if (!userId) {
            setError('Будь ласка, увійдіть в акаунт');
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
            if (!res.ok) throw new Error(`Помилка ${res.status}`);
            const data: Cart = await res.json();
            setCart(data);
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