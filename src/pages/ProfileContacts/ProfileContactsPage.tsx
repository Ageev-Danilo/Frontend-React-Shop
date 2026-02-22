import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfile } from '../../shared/api/hooks/useGetProfile';
import { useUpdateProfile } from '../../shared/api/hooks/useUpdateProfile';
import styles from './ProfileContactsPage.module.css';

export const ProfileContactsPage = () => {
    const { profile, isLoading } = useGetProfile();
    const { execute, isLoading: updating } = useUpdateProfile();
    const { register, handleSubmit, reset } = useForm({ mode: 'onBlur' });

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    const Sidebar = () => (
        <div className={styles.sidebar}>
            <h2 className={styles.sidebarMainTitle}>ОСОБИСТИЙ КАБІНЕТ</h2>
            <nav className={styles.nav}>
                <a href="/profile/contacts" className={styles.navLinkActive}>КОНТАКТНІ ДАНІ</a>
                <a href="/profile/address" className={styles.navLink}>АДРЕСА ДОСТАВКИ</a>
                <a href="/profile/orders" className={styles.navLink}>МОЇ ЗАМОВЛЕННЯ</a>
                <div className={styles.divider}></div>
                <button className={styles.exitBtn}>ВИЙТИ</button>
            </nav>
        </div>
    );

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <h1 className={styles.pageTitle}>КОНТАКТНІ ДАНІ</h1>
                <form onSubmit={handleSubmit((data) => execute(data))} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Прізвище</label>
                        <input {...register('lastName')} placeholder="Прізвище" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Ім'я</label>
                        <input {...register('firstName')} placeholder="Ім'я" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>По батькові</label>
                        <input {...register('middleName')} placeholder="По батькові" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Дата народження</label>
                        <input {...register('birthday')} placeholder="DD / MM / YYYY" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Телефон</label>
                        <input {...register('phone')} placeholder="+380" className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>E-mail</label>
                        <input {...register('email')} placeholder="email@example.com" className={styles.input} />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={updating}>
                        {updating ? 'Збереження...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                    </button>
                </form>
            </div>
        </div>
    );
};