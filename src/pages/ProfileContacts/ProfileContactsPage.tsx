import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfile, UserProfile } from '../../shared/api/hooks/useGetProfile';
import { useUpdateProfile } from '../../shared/api/hooks/useUpdateProfile';
import styles from './ProfileContactsPage.module.css';

type ContactsFormData = Pick<UserProfile, 'lastName' | 'firstName' | 'middleName' | 'birthday' | 'phone' | 'email'>;

export const ProfileContactsPage = () => {
    const { profile, isLoading: loadingProfile } = useGetProfile();
    const { execute, isLoading: updating, error, data: updateSuccess } = useUpdateProfile();
    
    const { register, handleSubmit, reset } = useForm<ContactsFormData>();

    useEffect(() => {
        if (profile) {
            reset({
                lastName: profile.lastName || '',
                firstName: profile.firstName || '',
                middleName: profile.middleName || '',
                birthday: profile.birthday || '',
                phone: profile.phone || '',
                email: profile.email || '',
            });
        }
    }, [profile, reset]);

    if (loadingProfile) return <div className={styles.loader}>Завантаження...</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarMainTitle}>ОСОБИСТИЙ КАБІНЕТ</h2>
                    <nav className={styles.nav}>
                        <a href="/profile/contacts" className={styles.navLinkActive}>КОНТАКТНІ ДАНІ</a>
                        <a href="/profile/address" className={styles.navLink}>АДРЕСА ДОСТАВКИ</a>
                        <a href="/profile/orders" className={styles.navLink}>МОЇ ЗАМОВЛЕННЯ</a>
                        <div className={styles.divider}></div>
                        <button className={styles.exitBtn}>ВИЙТИ</button>
                    </nav>
                </aside>

                <main className={styles.content}>
                    <h1 className={styles.pageTitle}>Контакті дані</h1>
                    
                    <form onSubmit={handleSubmit((data) => execute(data))} className={styles.form}>
                        <div className={styles.field}>
                            <label>Прізвище</label>
                            <input {...register('lastName')} className={styles.input} placeholder="Ваше Прізвище" />
                        </div>

                        <div className={styles.field}>
                            <label>Ім'я</label>
                            <input {...register('firstName')} className={styles.input} placeholder="Ваше Ім'я" />
                        </div>

                        <div className={styles.field}>
                            <label>По батькові</label>
                            <input {...register('middleName')} className={styles.input} placeholder="По батькові" />
                        </div>

                        <div className={styles.field}>
                            <label>Дата народження</label>
                            <input {...register('birthday')} className={styles.input} placeholder="DD / MM / YYYY" />
                        </div>

                        <div className={styles.field}>
                            <label>Телефон</label>
                            <input {...register('phone')} className={styles.input} placeholder="+380" />
                        </div>

                        <div className={styles.field}>
                            <label>E-mail</label>
                            <input {...register('email')} className={styles.input} placeholder="Ваш E-mail" />
                        </div>

                        {updateSuccess && <p className={styles.successMsg}>Дані збережено!</p>}
                        {error && <p className={styles.errorMsg}>{error}</p>}
                        
                        <button type="submit" className={styles.submitBtn} disabled={updating}>
                            {updating ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};