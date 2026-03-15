export function getUserId(): number | null {
    const raw = localStorage.getItem('user_id');
    if (!raw) return null;
    const id = Number(raw);
    return isNaN(id) ? null : id;
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function clearAuth(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
}

export function handleAuthError(status: number): void {
    if (status === 401 || status === 403) {
        clearAuth();
        window.dispatchEvent(new Event('storage'));
    }
}
 
export const AUTH_ERROR_MSG = 'Будь ласка, увійдіть в акаунт';