import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { Product } from '../../types/product';

interface UseGetPopularProducts {
    products: Product[];
    isLoading: boolean;
    error: string | null;
}

export function useGetPopularProducts(): UseGetPopularProducts {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getPopularProducts() {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/products/suggestions?popularProducts=true&limitPerPage=4`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        getPopularProducts();
    }, []);

    return { products, isLoading, error };
}