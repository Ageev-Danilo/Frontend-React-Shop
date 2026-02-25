import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfile, UserProfile } from '../../shared/api/hooks/useGetProfile';
import { useUpdateProfile } from '../../shared/api/hooks/useUpdateProfile';
import styles from './ProfileAddressPage.module.css';

type AddressFormData = Pick<UserProfile, 'city' | 'street' | 'building' | 'apartment' | 'postalCode'>;

const SAMPLE_ADDRESSES = [
    { city: 'Київ', street: 'вул. Жулянська', building: '11', apartment: '', postalCode: '', full: 'м. Київ, Відділення №3: вул. Жулянська, 11' },
    { city: 'Дніпро', street: 'вул. Маршала Малиновського', building: '114', apartment: '', postalCode: '', full: 'м. Дніпро, Відділення №1: вул. Маршала Малиновського, 114' },
];

export const ProfileAddressPage = () => {
    const { profile, isLoading: loadingProfile } = useGetProfile();
    const { execute, isLoading: updating, error, data: updateSuccess } = useUpdateProfile();
    const [savedAddresses, setSavedAddresses] = useState(SAMPLE_ADDRESSES);
    const [showForm, setShowForm] = useState(false);

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

    const handleAddAddress = () => {
        setShowForm(true);
    };

    const handleEditAddress = (address: any) => {
        reset(address);
        setShowForm(true);
    };

    const onSubmit = (data: AddressFormData) => {
        execute(data);
        //
    };

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
                    
                    <div className={styles.savedAddresses}>
                        {savedAddresses.map((addr, idx) => (
                            <div key={idx} className={styles.addressCard}>
                                <p>{addr.full}</p>
                                <button 
                                    className={styles.editBtn}
                                    onClick={() => handleEditAddress(addr)}
                                >
                                    Редагувати
                                </button>
                            </div>
                        ))}
                    </div>

                    {!showForm && (
                        <button className={styles.addAddressBtn} onClick={handleAddAddress}>
                            + ДОДАТИ АДРЕСУ
                        </button>
                    )}
                    
                    {showForm && (
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                            <div className={styles.field}>
                                <label>МІСТО</label>
                                <select {...register('city')} className={styles.input}>
                                    <option value="">Виберіть місто</option>
                                    <option value="Київ">Київ</option>
                                    <option value="Дніпро">Дніпро</option>
                                    <option value="Вінниця">Вінниця</option>
                                    <option value="Одеса">Одеса</option>
                                    <option value="Харків">Харків</option>
                                    <option value="Львів">Львів</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label>ВУЛИЦЯ</label>
                                <input 
                                    {...register('street')} 
                                    className={styles.input} 
                                    placeholder="вул. Маршала Малиновського" 
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>БУДИНОК</label>
                                    <input {...register('building')} className={styles.input} placeholder="114" />
                                </div>
                                <div className={styles.field}>
                                    <label>КВАРТИРА</label>
                                    <input {...register('apartment')} className={styles.input} placeholder="Номер квартири" />
                                </div>
                                <div className={styles.field}>
                                    <label>ПІД'ЇЗД</label>
                                    <input {...register('postalCode')} className={styles.input} placeholder="Номер під'їзду" />
                                </div>
                            </div>

                            {updateSuccess && <p className={styles.successMsg}>Дані збережено!</p>}
                            {error && <p className={styles.errorMsg}>{error}</p>}
                            
                            <button type="submit" className={styles.submitBtn} disabled={updating}>
                                {updating ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ ЗМІНИ'}
                            </button>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
};