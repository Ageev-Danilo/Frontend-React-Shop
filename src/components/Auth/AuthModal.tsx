import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthRequest } from '../../shared/api/hooks/useAuth';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    const loginHook = useAuthRequest('/auth/login');
    const registerHook = useAuthRequest('/auth/register');

    const { 
        register, 
        handleSubmit, 
        watch, 
        reset,
        formState: { errors } 
    } = useForm({ mode: 'onBlur' });

    if (!isOpen) return null;

    const onSubmit = async (data: any) => {
        if (isLogin) {
            await loginHook.sendRequest({ email: data.email, password: data.password });
        } else {
            const { confirmPassword, ...regData } = data;
            await registerHook.sendRequest(regData);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        reset();
    };

    const currentError = isLogin ? loginHook.error : registerHook.error;
    const currentLoading = isLogin ? loginHook.isLoading : registerHook.isLoading;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                
                <h2 className={styles.title}>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.inputField}>
                        <input 
                            {...register('email', { 
                                required: 'Пошта обов’язкова',
                                pattern: {
                                    //1
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Email повинен містити @ та .'
                                }
                            })} 
                            placeholder="Email"
                            className={errors.email ? styles.errorInput : ''}
                        />
                        {errors.email && <span className={styles.errorMsg}>{errors.email.message as string}</span>}
                    </div>

                    {!isLogin && (
                        <div className={styles.inputField}>
                            <input 
                                {...register('name', { required: 'Ім’я обов’язкове' })} 
                                placeholder="Ваше ім’я"
                            />
                        </div>
                    )}

                    <div className={styles.inputField}>
                        <input 
                            type="password"
                            {...register('password', { 
                                required: 'Пароль обов’язковий',
                                minLength: { value: 7, message: 'Мінімум 7 символів' }
                            })} 
                            placeholder="Пароль"
                        />
                        {errors.password && <span className={styles.errorMsg}>{errors.password.message as string}</span>}
                    </div>

                    {!isLogin && (
                        <div className={styles.inputField}>
                            <input 
                                type="password"
                                {...register('confirmPassword', { 
                                    required: 'Підтвердіть пароль',
                                    validate: (val) => val === watch('password') || 'Паролі не співпадають'
                                })} 
                                placeholder="Підтвердіть пароль"
                            />
                            {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword.message as string}</span>}
                        </div>
                    )}

                    {currentError && <p className={styles.serverError}>{currentError}</p>}

                    <button type="submit" className={styles.submitBtn} disabled={currentLoading}>
                        {currentLoading ? 'Зачекайте...' : isLogin ? 'Увійти' : 'Створити акаунт'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'} 
                    <span onClick={toggleMode}>{isLogin ? ' Зареєструватися' : ' Увійти'}</span>
                </p>
            </div>
        </div>
    );
};