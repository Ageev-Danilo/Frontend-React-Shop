import { useState, useEffect } from 'react';
import { API_URL } from '../api-url';

export interface UserProfile {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    email?: string;
    birthday?: string; 
    city?: string;
    street?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
}

export const useGetProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                
                const response = await fetch(`${API_URL}/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Не вдалося завантажити дані');
                }

                const data: UserProfile = await response.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message || 'Помилка завантаження');
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, isLoading, error };
};