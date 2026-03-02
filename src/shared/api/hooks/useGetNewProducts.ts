import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';
import { Product } from '../../types/product';

interface UseGetNewProducts {
    products: Product[];
    isLoading: boolean;
    error: string | null;
}

export function useGetNewProducts(): UseGetNewProducts {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getNewProducts() {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/products/suggestions?isNew=true&popular=false&limit=3&offset=0`, {
                    
                    method: "GET",
                    body: "product",
                    headers:  {"Content-Type": "application/json"}
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
        
        getNewProducts();
    }, []);

    return { products, isLoading, error };
}