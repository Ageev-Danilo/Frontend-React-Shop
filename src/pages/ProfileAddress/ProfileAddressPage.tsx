import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfile, UserProfile } from '../../shared/api/hooks/useGetProfile';
import { useUpdateProfile } from '../../shared/api/hooks/useUpdateProfile';
import styles from './ProfileAddressPage.module.css';

type AddressFormData = Pick<UserProfile, 'city' | 'street' | 'building' | 'apartment' | 'postalCode'>;

export const ProfileAddressPage = () => {
    const { profile, isLoading: loadingProfile } = useGetProfile();
    const { execute, isLoading: updating, error, data: updateSuccess } = useUpdateProfile();

    const { register, handleSubmit, reset } = useForm<AddressFormData>();

    useEffect(() => {
        if (profile) {
            reset({
                city: profile.city || '',
                street: profile.street || '',
                building: profile.building || '',
                apartment: profile.apartment || '',
                postalCode: profile.postalCode || '',
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
                        <a href="/profile/contacts" className={styles.navLink}>КОНТАКТНІ ДАНІ</a>
                        <a href="/profile/address" className={styles.navLinkActive}>АДРЕСА ДОСТАВКИ</a>
                        <a href="/profile/orders" className={styles.navLink}>МОЇ ЗАМОВЛЕННЯ</a>
                        <div className={styles.divider}></div>
                        <button className={styles.exitBtn}>ВИЙТИ</button>
                    </nav>
                </aside>

                <main className={styles.content}>
                    <h1 className={styles.pageTitle}>АДРЕСА ДОСТАВКИ</h1>
                    
                    <form onSubmit={handleSubmit((data) => execute(data))} className={styles.form}>
                        <div className={styles.field}>
                            <label>МІСТО</label>
                            <input {...register('city')} className={styles.input} placeholder="Вінниця" />
                        </div>

                        <div className={styles.field}>
                            <label>ВУЛИЦЯ</label>
                            <input {...register('street')} className={styles.input} placeholder="вул. Маршала Малиновського" />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>БУДИНОК</label>
                                <input {...register('building')} className={styles.input} placeholder="114" />
                            </div>
                            <div className={styles.field}>
                                <label>КВАРТИРА</label>
                                <input {...register('apartment')} className={styles.input} placeholder="12" />
                            </div>
                            <div className={styles.field}>
                                <label>ПІД'ЇЗД</label>
                                <input {...register('postalCode')} className={styles.input} placeholder="3" />
                            </div>
                        </div>

                        {updateSuccess && <p className={styles.successMsg}>Дані збережено!</p>}
                        
                        <button type="submit" className={styles.submitBtn} disabled={updating}>
                            {updating ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};