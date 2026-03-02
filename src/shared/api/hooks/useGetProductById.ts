import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetProductById = (id: string | undefined) => {
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8000/products/${id}`);//?
                setProduct(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Помилка завантаження');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, isLoading, error };
};