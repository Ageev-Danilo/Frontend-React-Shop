import { useState } from 'react';
import { API_URL } from '../api-url';
import { UserProfile } from './useGetProfile';

interface UpdateProfileResponse {
    message?: string;
}

export const useUpdateProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<UpdateProfileResponse | null>(null);

    const execute = async (profileData: Partial<UserProfile>): Promise<UpdateProfileResponse | null> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const result: UpdateProfileResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Помилка оновлення');
            }

            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Щось пішло не так');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { execute, isLoading, error, data };
};