import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetDelivery } from '../../shared/api/hooks/useGetDelivery';
import { useUpdateDelivery } from '../../shared/api/hooks/useUpdateDelivery';
import styles from './ProfileAddressPage.module.css';

type AddressFormData = {
    city: string;
    street: string;
    building: string;
    apartment: string;
    entrance: string;
};

const CITIES = ['Вінниця', 'Одеса', 'Харків', 'Дніпро', 'Київ', 'Львів'];

export const ProfileAddressPage = () => {
    const { delivery, isLoading } = useGetDelivery();
    const { execute, isLoading: updating, error, data: updateSuccess } = useUpdateDelivery();

    const [isEditing, setIsEditing] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);

    const { register, handleSubmit, reset, setValue, watch } = useForm<AddressFormData>();
    const cityValue = watch('city');

    useEffect(() => {
        if (delivery) {
            reset({
                city: delivery.city || '',
                street: delivery.street || '',
                building: delivery.building || '',
                apartment: delivery.apartment || '',
                entrance: delivery.entrance || '',
            });
        }
    }, [delivery, reset]);

    const onSubmit = async (data: AddressFormData) => {
        await execute(data);
        setIsEditing(false);
        setShowNewForm(false);
    };

    const getFullAddress = () => {
        if (!delivery?.city) return 'Адресу не вказано';
        return `м. ${delivery.city}, вул. ${delivery.street}, ${delivery.building}`;
    };

    if (isLoading) return <div className={styles.loader}>Завантаження...</div>;

    const renderForm = () => (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.fieldLabel}>Місто</label>
                <input {...register('city')} className={styles.input} placeholder="Місто" />
                <div className={styles.cityChips}>
                    {CITIES.map(city => (
                        <button
                            key={city}
                            type="button"
                            className={`${styles.cityChip} ${cityValue === city ? styles.cityChipActive : ''}`}
                            onClick={() => setValue('city', city)}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.fieldLabel}>Вулиця</label>
                <input {...register('street')} className={styles.input} placeholder="вул. Маршала Малиновського" />
            </div>

            <div className={styles.field}>
                <label className={styles.fieldLabel}>Будинок</label>
                <input {...register('building')} className={styles.input} placeholder="114" />
            </div>

            <div className={styles.field}>
                <label className={styles.fieldLabel}>Квартира</label>
                <input {...register('apartment')} className={styles.input} placeholder="Номер квартири" />
            </div>

            <div className={styles.field}>
                <label className={styles.fieldLabel}>Під'їзд</label>
                <input {...register('entrance')} className={styles.input} placeholder="Номер під'їзду" />
            </div>

            {updateSuccess && <p className={styles.successMsg}>Дані збережено!</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={updating}>
                {updating ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ ЗМІНИ'}
            </button>
        </form>
    );

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
                    <h1 className={styles.pageTitle}>Адреса доставки</h1>

                    <div className={styles.addressList}>
                        <div className={`${styles.addressCard} ${isEditing ? styles.addressCardActive : ''}`}>
                            <div className={styles.addressCardHeader}>
                                <div
                                    className={styles.radioLabel}
                                    onClick={() => setIsSelected(s => !s)}
                                >
                                    <span className={`${styles.radioCustom} ${isSelected ? styles.radioCustomSelected : ''}`}>
                                        {isSelected && <span className={styles.radioDot} />}
                                    </span>
                                    <span className={styles.addressText}>{getFullAddress()}</span>
                                </div>

                                <button
                                    className={styles.editIconBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(prev => !prev);
                                        setShowNewForm(false);
                                    }}
                                    aria-label="Редагувати"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                            </div>

                            {isEditing && (
                                <div className={styles.formWrapper}>
                                    {renderForm()}
                                </div>
                            )}
                        </div>

                        {showNewForm && (
                            <div className={`${styles.addressCard} ${styles.addressCardActive}`}>
                                <div className={styles.formWrapper}>
                                    {renderForm()}
                                </div>
                            </div>
                        )}
                    </div>

                    {!showNewForm && (
                        <button
                            className={styles.addAddressBtn}
                            onClick={() => {
                                setShowNewForm(true);
                                setIsEditing(false);
                                reset({ city: '', street: '', building: '', apartment: '', entrance: '' });
                            }}
                        >
                            + ДОДАТИ АДРЕСУ
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
};