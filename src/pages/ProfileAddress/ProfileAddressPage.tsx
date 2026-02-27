import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ProfileAddressPage.module.css';

type Address = {
    id: number;
    city: string;
    street: string;
    building: string;
    apartment: string;
    entrance: string;
    full: string;
};

const CITIES = ['Вінниця', 'Одеса', 'Харків', 'Дніпро', 'Київ', 'Львів'];

const INITIAL_ADDRESSES: Address[] = [
    { id: 1, city: 'Київ', street: 'вул. Жулянська', building: '11', apartment: '', entrance: '', full: 'м. Київ, Відділення №3: вул. Жулянська, 11' },
    { id: 2, city: 'Дніпро', street: 'вул. Маршала Малиновського', building: '114', apartment: '', entrance: '', full: 'м. Дніпро, Відділення №1: вул. Маршала Малиновського, 114' },
];

export const ProfileAddressPage = () => {
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);

    const { register, handleSubmit, reset, setValue, watch } = useForm<Omit<Address, 'id' | 'full'>>();
    const cityValue = watch('city');

    const handleEdit = (addr: Address) => {
        setEditingId(addr.id);
        setShowNewForm(false);
        reset({
            city: addr.city,
            street: addr.street,
            building: addr.building,
            apartment: addr.apartment,
            entrance: addr.entrance,
        });
    };

    const handleAddNew = () => {
        setShowNewForm(true);
        setEditingId(null);
        reset({ city: '', street: '', building: '', apartment: '', entrance: '' });
    };

    const onSubmit = (data: Omit<Address, 'id' | 'full'>) => {
        const full = `м. ${data.city}, вул. ${data.street}, ${data.building}`;
        if (editingId !== null) {
            setAddresses(prev =>
                prev.map(a => (a.id === editingId ? { ...a, ...data, full } : a))
            );
            setEditingId(null);
        } else {
            const newAddr: Address = { id: Date.now(), ...data, full };
            setAddresses(prev => [...prev, newAddr]);
            setShowNewForm(false);
        }
    };

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

            <button type="submit" className={styles.submitBtn}>
                ЗБЕРЕГТИ ЗМІНИ
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
                        {addresses.map(addr => (
                            <div
                                key={addr.id}
                                className={`${styles.addressCard} ${editingId === addr.id ? styles.addressCardActive : ''}`}
                            >
                                <div className={styles.addressCardHeader}>
                                    <div
                                        className={styles.radioLabel}
                                        onClick={() => setSelectedId(addr.id)}
                                    >
                                        <span className={`${styles.radioCustom} ${selectedId === addr.id ? styles.radioCustomSelected : ''}`}>
                                            {selectedId === addr.id && <span className={styles.radioDot}></span>}
                                        </span>
                                        <span className={styles.addressText}>{addr.full}</span>
                                    </div>

                                    <button
                                        className={styles.editIconBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            editingId === addr.id ? setEditingId(null) : handleEdit(addr);
                                        }}
                                        aria-label="Редагувати"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>

                                {editingId === addr.id && (
                                    <div className={styles.formWrapper}>
                                        {renderForm()}
                                    </div>
                                )}
                            </div>
                        ))}

                        {showNewForm && (
                            <div className={`${styles.addressCard} ${styles.addressCardActive}`}>
                                <div className={styles.formWrapper}>
                                    {renderForm()}
                                </div>
                            </div>
                        )}
                    </div>

                    {!showNewForm && (
                        <button className={styles.addAddressBtn} onClick={handleAddNew}>
                            + ДОДАТИ АДРЕСУ
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
};