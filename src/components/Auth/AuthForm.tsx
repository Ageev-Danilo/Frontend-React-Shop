import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useRegister } from '../../shared/api/hooks/useRegister';
import { useForgotPassword } from '../../shared/api/hooks/useForgotPassword';
import { useResetPassword } from '../../shared/api/hooks/useResetPassword';
import {useLogin} from "../../shared/api/hooks/useLogin"

type AuthView = 'login' | 'register' | 'forgotPassword' | 'newPassword' | 'resetSuccess' | 'registerSuccess';

interface AuthFormProps {
    initialMode?: AuthView;
}

const EyeIcon = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button type="button" className={styles.eyeBtn} onClick={onToggle} tabIndex={-1}>
        {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="#a1a1aa" strokeWidth="2"/>
            </svg>
        )}
    </button>
);

export const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
    const [view, setView] = useState<AuthView>(initialMode);
    const navigate = useNavigate();

    const { execute: registerExecute, isLoading: registerLoading, error: registerError } = useRegister();
    const { execute: loginExecute, isLoading: loginLoading, error: loginError } = useLogin();

    const { execute: forgotExecute, isLoading: forgotLoading, error: forgotError } = useForgotPassword();
    const { execute: resetExecute, isLoading: resetLoading, error: resetError } = useResetPassword();

    const [showLoginPwd, setShowLoginPwd] = useState(false);
    const [showRegPwd, setShowRegPwd] = useState(false);
    const [showRegConfirm, setShowRegConfirm] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showNewConfirm, setShowNewConfirm] = useState(false);

    const loginForm = useForm({ mode: 'onBlur' });
    const registerForm = useForm({ mode: 'onBlur' });
    const forgotForm = useForm({ mode: 'onBlur' });
    const newPasswordForm = useForm({ mode: 'onBlur' });

    const handleClose = () => navigate('/');

    const onLoginSubmit = async (data: any) => {
        const result = await loginExecute('/auth/login', data);
        if (result) navigate('/');
    };

    const onRegisterSubmit = async (data: any) => {
        const result = await registerExecute('/auth/register', data);
        if (result) setView('registerSuccess');
    };

    const onForgotSubmit = async (data: any) => {
        const result = await forgotExecute(data);
        if (result) navigate('/reset-password');
    };

    const onNewPasswordSubmit = async (data: any) => {
        const result = await resetExecute(data);
        if (result) setView('resetSuccess');
    };

    const isAuthView = view === 'login' || view === 'register';

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {isAuthView && (
                    <div className={styles.modalHeader}>
                        <div className={styles.tabRow}>
                            <button
                                className={`${styles.tab} ${view === 'login' ? styles.tabActive : styles.tabInactive}`}
                                onClick={() => setView('login')}
                            >
                                Авторизація
                            </button>
                            <span className={styles.tabSeparator}>/</span>
                            <button
                                className={`${styles.tab} ${view === 'register' ? styles.tabActive : styles.tabInactive}`}
                                onClick={() => setView('register')}
                            >
                                Реєстрація
                            </button>
                        </div>
                        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
                    </div>
                )}

                {(view === 'forgotPassword' || view === 'newPassword' || view === 'resetSuccess' || view === 'registerSuccess') && (
                    <div className={styles.modalHeaderSimple}>
                        <h2 className={styles.modalTitle}>
                            {view === 'forgotPassword' && 'Відновлення пароля'}
                            {view === 'newPassword' && 'Новий пароль'}
                            {view === 'resetSuccess' && 'Новий пароль'}
                            {view === 'registerSuccess' && 'Реєстрація'}
                        </h2>
                        {(view === 'forgotPassword' || view === 'newPassword') && (
                            <button className={styles.closeBtn} onClick={handleClose}>✕</button>
                        )}
                    </div>
                )}

                {view === 'login' && (
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                {...loginForm.register('email', {
                                    required: "Обов'язкове поле",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email має містити @ та .' }
                                })}
                                placeholder="Введіть email"
                                className={`${styles.input} ${loginForm.formState.errors.email ? styles.inputError : ''}`}
                            />
                            {loginForm.formState.errors.email && (
                                <span className={styles.errorText}>{loginForm.formState.errors.email.message as string}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Пароль</label>
                            <div className={styles.inputWrap}>
                                <input
                                    type={showLoginPwd ? 'text' : 'password'}
                                    {...loginForm.register('password', {
                                        required: "Обов'язкове поле",
                                        minLength: { value: 7, message: 'Мінімум 7 символів' }
                                    })}
                                    placeholder="Введіть пароль"
                                    className={`${styles.input} ${loginForm.formState.errors.password ? styles.inputError : ''}`}
                                />
                                <EyeIcon show={showLoginPwd} onToggle={() => setShowLoginPwd(p => !p)} />
                            </div>
                            {loginForm.formState.errors.password && (
                                <span className={styles.errorText}>{loginForm.formState.errors.password.message as string}</span>
                            )}
                        </div>

                        <button
                            type="button"
                            className={styles.forgotLink}
                            onClick={() => navigate('/forgot-password')}
                        >
                            Забули пароль?
                        </button>

                        {loginError && <p className={styles.apiError}>{loginError}</p>}

                        <div className={styles.btnRow}>
                            <button type="button" className={styles.cancelBtn} onClick={handleClose}>СКАСУВАТИ</button>
                            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
                                {loginLoading ? 'Завантаження...' : 'УВІЙТИ'}
                            </button>
                        </div>
                    </form>
                )}

                {view === 'register' && (
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Ім'я</label>
                            <input
                                {...registerForm.register('name', { required: "Обов'язкове поле" })}
                                placeholder="Введіть ім'я"
                                className={`${styles.input} ${registerForm.formState.errors.name ? styles.inputError : ''}`}
                            />
                            {registerForm.formState.errors.name && (
                                <span className={styles.errorText}>{registerForm.formState.errors.name.message as string}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                {...registerForm.register('email', {
                                    required: "Обов'язкове поле",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email має містити @ та .' }
                                })}
                                placeholder="Введіть email"
                                className={`${styles.input} ${registerForm.formState.errors.email ? styles.inputError : ''}`}
                            />
                            {registerForm.formState.errors.email && (
                                <span className={styles.errorText}>{registerForm.formState.errors.email.message as string}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Пароль</label>
                            <div className={styles.inputWrap}>
                                <input
                                    type={showRegPwd ? 'text' : 'password'}
                                    {...registerForm.register('password', {
                                        required: "Обов'язкове поле",
                                        minLength: { value: 7, message: 'Мінімум 7 символів' }
                                    })}
                                    placeholder="Введіть пароль"
                                    className={`${styles.input} ${registerForm.formState.errors.password ? styles.inputError : ''}`}
                                />
                                <EyeIcon show={showRegPwd} onToggle={() => setShowRegPwd(p => !p)} />
                            </div>
                            {registerForm.formState.errors.password && (
                                <span className={styles.errorText}>{registerForm.formState.errors.password.message as string}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Підтвердження пароля</label>
                            <div className={styles.inputWrap}>
                                <input
                                    type={showRegConfirm ? 'text' : 'password'}
                                    {...registerForm.register('confirmPassword', {
                                        required: "Обов'язкове поле",
                                        validate: (val) => val === registerForm.watch('password') || 'Паролі не співпадають'
                                    })}
                                    placeholder="Повторіть пароль"
                                    className={`${styles.input} ${registerForm.formState.errors.confirmPassword ? styles.inputError : ''}`}
                                />
                                <EyeIcon show={showRegConfirm} onToggle={() => setShowRegConfirm(p => !p)} />
                            </div>
                            {registerForm.formState.errors.confirmPassword && (
                                <span className={styles.errorText}>{registerForm.formState.errors.confirmPassword.message as string}</span>
                            )}
                        </div>

                        <button type="button" className={styles.switchLink} onClick={() => setView('login')}>
                            Вже в акаунті? Увійти
                        </button>

                        {registerError && <p className={styles.apiError}>{registerError}</p>}

                        <div className={styles.btnRow}>
                            <button type="button" className={styles.cancelBtn} onClick={handleClose}>СКАСУВАТИ</button>
                            <button type="submit" className={styles.submitBtn} disabled={registerLoading}>
                                {registerLoading ? 'Завантаження...' : 'ЗАРЕЄСТРУВАТИСЯ'}
                            </button>
                        </div>

                        <p className={styles.offerText}>
                            При вході або реєстрації, я підтверджую згоду з умовами{' '}
                            <a href="#" className={styles.offerLink}>публічного договору</a>
                        </p>
                    </form>
                )}

                {view === 'forgotPassword' && (
                    <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                {...forgotForm.register('email', {
                                    required: "Обов'язкове поле",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email має містити @ та .' }
                                })}
                                placeholder="Введіть email"
                                className={`${styles.input} ${forgotForm.formState.errors.email ? styles.inputError : ''}`}
                            />
                            {forgotForm.formState.errors.email && (
                                <span className={styles.errorText}>{forgotForm.formState.errors.email.message as string}</span>
                            )}
                        </div>

                        {forgotError && <p className={styles.apiError}>{forgotError}</p>}

                        <div className={styles.btnRow}>
                            <button type="button" className={styles.cancelBtn} onClick={handleClose}>СКАСУВАТИ</button>
                            <button type="submit" className={styles.submitBtn} disabled={forgotLoading}>
                                {forgotLoading ? 'Відправка...' : 'НАДІСЛАТИ ЛИСТ'}
                            </button>
                        </div>
                    </form>
                )}

                {view === 'newPassword' && (
                    <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Пароль</label>
                            <div className={styles.inputWrap}>
                                <input
                                    type={showNewPwd ? 'text' : 'password'}
                                    {...newPasswordForm.register('password', {
                                        required: "Обов'язкове поле",
                                        minLength: { value: 7, message: 'Мінімум 7 символів' }
                                    })}
                                    placeholder="Новий пароль"
                                    className={`${styles.input} ${newPasswordForm.formState.errors.password ? styles.inputError : ''}`}
                                />
                                <EyeIcon show={showNewPwd} onToggle={() => setShowNewPwd(p => !p)} />
                            </div>
                            {newPasswordForm.formState.errors.password && (
                                <span className={styles.errorText}>{newPasswordForm.formState.errors.password.message as string}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Підтвердження пароля</label>
                            <div className={styles.inputWrap}>
                                <input
                                    type={showNewConfirm ? 'text' : 'password'}
                                    {...newPasswordForm.register('confirmPassword', {
                                        required: "Обов'язкове поле",
                                        validate: (val) => val === newPasswordForm.watch('password') || 'Паролі не співпадають'
                                    })}
                                    placeholder="Повторіть пароль"
                                    className={`${styles.input} ${newPasswordForm.formState.errors.confirmPassword ? styles.inputError : ''}`}
                                />
                                <EyeIcon show={showNewConfirm} onToggle={() => setShowNewConfirm(p => !p)} />
                            </div>
                            {newPasswordForm.formState.errors.confirmPassword && (
                                <span className={styles.errorText}>{newPasswordForm.formState.errors.confirmPassword.message as string}</span>
                            )}
                        </div>

                        {resetError && <p className={styles.apiError}>{resetError}</p>}

                        <div className={styles.btnRow}>
                            <button type="button" className={styles.cancelBtn} onClick={handleClose}>СКАСУВАТИ</button>
                            <button type="submit" className={styles.submitBtn} disabled={resetLoading}>
                                {resetLoading ? 'Збереження...' : 'ЗБЕРЕГТИ НОВИЙ ПАРОЛЬ'}
                            </button>
                        </div>
                    </form>
                )}

                {view === 'resetSuccess' && (
                    <div className={styles.successBody}>
                        <p className={styles.successText}>
                            Пароль успішно змінено!<br />
                            Тепер ви можете увійти з новим паролем.
                        </p>
                        <button className={styles.submitBtn} onClick={() => navigate('/login')}>
                            УВІЙТИ
                        </button>
                    </div>
                )}

                {view === 'registerSuccess' && (
                    <div className={styles.successBody}>
                        <p className={styles.successText}>Акаунт успішно створено!</p>
                        <button className={styles.submitBtn} onClick={() => navigate('/')}>
                            ПЕРЕЙТИ НА САЙТ
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};