import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetCart } from '../../shared/api/hooks/useGetCart';
import { useCreateOrder, CreateOrderData } from '../../shared/api/hooks/useCreateOrder';
import { EditCartModal } from '../../components/EditCartModal/EditCartModal';
import styles from './CheckoutPage.module.css';

import npIcon        from '../../assets/icons/np.png';
import visaIcon      from '../../assets/icons/visa.png';
import googlePayIcon from '../../assets/icons/Google_Pay.png';
import applePayIcon  from '../../assets/icons/ApplePay.png';
import mastercardIcon from '../../assets/icons/mastercard.png';

interface NovaPoshtaCity {
    Ref: string;
    Description: string;
    AreaDescription: string;
}
interface NovaPoshtaWarehouse {
    Ref: string;
    Description: string;
}

const WAREHOUSE_TYPE = '841339c7-591a-42e2-8233-7a0a00f7a000';
const POSTOMАТ_TYPE  = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0';
const NP_API_KEY     = 'cd69e16d2f7d7eab264687e030d3a09b';
const NP_API_URL     = 'https://api.novaposhta.ua/v2.0/json/';
const QUICK_CITIES   = ['Вінниця', 'Одеса', 'Харків', 'Дніпро', 'Київ', 'Львів'];

const NpLogo = () => (
    <img src={npIcon} alt="Нова Пошта" className={styles.npLogo} />
);

async function fetchCities(query: string): Promise<NovaPoshtaCity[]> {
    if (!query || query.length < 2) return [];
    const res = await fetch(NP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey: NP_API_KEY,
            modelName: 'AddressGeneral',
            calledMethod: 'getCities',
            methodProperties: { FindByString: query, Limit: 8 },
        }),
    });
    const data = await res.json();
    return data.success ? (data.data as NovaPoshtaCity[]) : [];
}

async function fetchWarehouses(cityRef: string, typeRef: string): Promise<NovaPoshtaWarehouse[]> {
    if (!cityRef) return [];
    const res = await fetch(NP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey: NP_API_KEY,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: { CityRef: cityRef, TypeOfWarehouseRef: typeRef, Limit: 50 },
        }),
    });
    const data = await res.json();
    return data.success ? (data.data as NovaPoshtaWarehouse[]) : [];
}

interface CheckoutFormData {
    firstName:       string;
    lastName:        string;
    patronymic:      string;
    phone:           string;
    email:           string;
    deliveryType:    'postomат' | 'warehouse' | 'express' | 'courier';
    paymentMethod:   'cash' | 'online' | 'card' | 'privat' | 'apple' | 'google';
    comment?:        string;
    expressAddress?: string;
    courierCity?:    string;
    courierAddress?: string;
}

const PAYMENT_OPTIONS: { value: CheckoutFormData['paymentMethod']; label: string }[] = [
    { value: 'cash',   label: 'Оплата при отриманні' },
    { value: 'online', label: 'Оплатити зараз'       },
    { value: 'card',   label: 'Карткою онлайн'       },
    { value: 'privat', label: 'Privat Pay'            },
    { value: 'apple',  label: 'Apple Pay'             },
    { value: 'google', label: 'Google Pay'            },
];

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, isLoading: cartLoading } = useGetCart();
    const { execute: createOrder, isLoading: orderLoading, error: orderError } = useCreateOrder();
    const [orderSuccess, setOrderSuccess]       = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [cityInput, setCityInput]                   = useState('');
    const [cityOptions, setCityOptions]               = useState<NovaPoshtaCity[]>([]);
    const [selectedCity, setSelectedCity]             = useState<NovaPoshtaCity | null>(null);
    const [showCityList, setShowCityList]             = useState(false);
    const [warehouseInput, setWarehouseInput]         = useState('');
    const [warehouseOptions, setWarehouseOptions]     = useState<NovaPoshtaWarehouse[]>([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
    const [showWarehouseList, setShowWarehouseList]   = useState(false);
    const [npLoading, setNpLoading]                   = useState(false);
    const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
        defaultValues: { deliveryType: 'warehouse', paymentMethod: 'online' },
    });

    const deliveryType  = watch('deliveryType');
    const paymentMethod = watch('paymentMethod');

    useEffect(() => {
        if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
        if (!cityInput || cityInput.length < 2) { setCityOptions([]); return; }
        cityDebounceRef.current = setTimeout(async () => {
            const cities = await fetchCities(cityInput);
            setCityOptions(cities);
            setShowCityList(cities.length > 0);
        }, 350);
    }, [cityInput]);

    useEffect(() => {
        if (!selectedCity) return;
        const type = deliveryType === 'postomат' ? POSTOMАТ_TYPE : WAREHOUSE_TYPE;
        setNpLoading(true);
        fetchWarehouses(selectedCity.Ref, type).then(list => {
            setWarehouseOptions(list);
            setFilteredWarehouses(list);
            setNpLoading(false);
        });
        setWarehouseInput('');
    }, [selectedCity, deliveryType]);

    useEffect(() => {
        if (!warehouseInput) { setFilteredWarehouses(warehouseOptions); return; }
        const q = warehouseInput.toLowerCase();
        setFilteredWarehouses(warehouseOptions.filter(w => w.Description.toLowerCase().includes(q)));
    }, [warehouseInput, warehouseOptions]);

    const handleCitySelect = (city: NovaPoshtaCity) => {
        setSelectedCity(city);
        setCityInput(city.Description);
        setShowCityList(false);
    };
    const handleQuickCity = (name: string) => {
        setCityInput(name);
        fetchCities(name).then(list => { if (list.length > 0) handleCitySelect(list[0]); });
    };
    const handleWarehouseSelect = (wh: NovaPoshtaWarehouse) => {
        setWarehouseInput(wh.Description);
        setShowWarehouseList(false);
    };

    const onSubmit = async (formData: CheckoutFormData) => {
        const orderData: CreateOrderData = {
            payment:        formData.paymentMethod,
            comment:        formData.comment,
            totalPrice:     cart.total,
            deliveryStatus: 'pending',
        };
        const result = await createOrder(orderData);
        if (result) {
            setOrderSuccess(true);
            setTimeout(() => navigate('/profile/orders'), 2000);
        }
    };

    const hasItems = !!(cart.items && cart.items.length > 0);
    const savedAmount = cart.items?.reduce((sum, item) =>
        sum + (item.price * 0.1) * item.quantity, 0) ?? 0;

    const renderNpPicker = (type: 'postomат' | 'warehouse') => (
        <div className={styles.npPicker} onClick={e => e.preventDefault()}>
            <div className={styles.field} style={{ position: 'relative' }}>
                <label className={styles.label}>Місто</label>
                <input
                    className={styles.input}
                    value={cityInput}
                    placeholder="Введіть місто..."
                    autoComplete="off"
                    onChange={e => { setCityInput(e.target.value); setSelectedCity(null); }}
                    onFocus={() => cityOptions.length > 0 && setShowCityList(true)}
                    onBlur={() => setTimeout(() => setShowCityList(false), 150)}
                />
                {showCityList && cityOptions.length > 0 && (
                    <ul className={styles.dropdown}>
                        {cityOptions.map(c => (
                            <li key={c.Ref} onMouseDown={() => handleCitySelect(c)}>
                                {c.Description}
                                <span className={styles.dropdownSub}> {c.AreaDescription} обл.</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className={styles.quickCities}>
                {QUICK_CITIES.map(name => (
                    <button key={name} type="button" className={styles.quickCity}
                        onMouseDown={e => { e.preventDefault(); handleQuickCity(name); }}>
                        {name}
                    </button>
                ))}
            </div>
            <div className={styles.field} style={{ position: 'relative' }}>
                    <label className={styles.label}>
                        {type === 'postomат' ? 'Адреса поштомату' : 'Адреса відділення'}
                    </label>
                    <input
                        className={styles.input}
                        value={warehouseInput}
                        placeholder={npLoading ? 'Завантаження...' : selectedCity ? `Пошук ${type === 'postomат' ? 'поштомату' : 'відділення'}...` : 'Спочатку виберіть місто'}
                        autoComplete="off"
                        disabled={npLoading || !selectedCity}
                        onChange={e => { setWarehouseInput(e.target.value); setShowWarehouseList(true); }}
                        onFocus={() => setShowWarehouseList(true)}
                        onBlur={() => setTimeout(() => setShowWarehouseList(false), 150)}
                    />
                    {showWarehouseList && filteredWarehouses.length > 0 && (
                        <ul className={styles.dropdown}>
                            {filteredWarehouses.slice(0, 20).map(wh => (
                                <li key={wh.Ref} onMouseDown={() => handleWarehouseSelect(wh)}>
                                    {wh.Description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
        </div>
    );

    const renderCourierPicker = () => (
        <div className={styles.npPicker} onClick={e => e.preventDefault()}>
            <div className={styles.field}>
                <label className={styles.label}>Місто</label>
                <input {...register('courierCity')} className={styles.input} placeholder="Введіть місто доставки..." />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Адреса доставки</label>
                <input
                    {...register('courierAddress')}
                    className={styles.input}
                    placeholder={watch('courierCity') ? 'Вул. Назва, буд. №, кв. №' : 'Спочатку виберіть місто'}
                    disabled={!watch('courierCity')}
                />
            </div>
        </div>
    );

    const renderExpressPicker = () => (
        <div className={styles.npPicker} onClick={e => e.preventDefault()}>
            <div className={styles.field}>
                <label className={styles.label}>Адреса доставки (Київ)</label>
                <input {...register('expressAddress')} className={styles.input} placeholder="Вул. Назва, буд. №, кв. №" />
            </div>
        </div>
    );

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Оформлення замовлення</h1>
            <div className={styles.titleDivider} />

            <div className={styles.container}>
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Ваші контактні дані</h2>
                            {[
                                { name: 'lastName',   label: 'Прізвище',    placeholder: 'Ваше Прізвище' },
                                { name: 'firstName',  label: "Ім'я",        placeholder: "Ваше Ім'я" },
                                { name: 'patronymic', label: 'По батькові', placeholder: 'По батькові' },
                                { name: 'phone',      label: 'Телефон',     placeholder: '+ 38 0' },
                                { name: 'email',      label: 'E-mail',      placeholder: 'Ваш E-mail' },
                            ].map(f => (
                                <div className={styles.field} key={f.name}>
                                    <label className={styles.label}>{f.label}</label>
                                    <input
                                        {...register(f.name as keyof CheckoutFormData, {
                                            required: "Обов'язкове поле",
                                            ...(f.name === 'email' ? { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Невірний email' } } : {}),
                                        })}
                                        className={`${styles.input} ${errors[f.name as keyof CheckoutFormData] ? styles.inputError : ''}`}
                                        placeholder={f.placeholder}
                                    />
                                    {errors[f.name as keyof CheckoutFormData] && (
                                        <span className={styles.fieldError}>{errors[f.name as keyof CheckoutFormData]?.message}</span>
                                    )}
                                </div>
                            ))}
                            <div className={styles.field}>
                                <label className={styles.label}>Коментар до замовлення</label>
                                <textarea {...register('comment')} className={styles.textarea} placeholder="Що б ви хотіли уточнити" rows={4} />
                            </div>
                        </div>

                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Доставка</h2>

                            <label className={`${styles.radioRow} ${deliveryType === 'postomат' ? styles.radioRowActive : ''}`}>
                                <div className={styles.radioRowTop}>
                                    <input type="radio" {...register('deliveryType')} value="postomат" />
                                    <span>Нова Пошта до поштомату</span>
                                    <NpLogo />
                                </div>
                                {deliveryType === 'postomат' && renderNpPicker('postomат')}
                            </label>

                            <label className={`${styles.radioRow} ${deliveryType === 'warehouse' ? styles.radioRowActive : ''}`}>
                                <div className={styles.radioRowTop}>
                                    <input type="radio" {...register('deliveryType')} value="warehouse" />
                                    <span>Нова Пошта до відділення</span>
                                    <NpLogo />
                                </div>
                                {deliveryType === 'warehouse' && renderNpPicker('warehouse')}
                            </label>

                            <label className={`${styles.radioRow} ${deliveryType === 'express' ? styles.radioRowActive : ''}`}>
                                <div className={styles.radioRowTop}>
                                    <input type="radio" {...register('deliveryType')} value="express" />
                                    <span>Експрес-доставка по Києву</span>
                                </div>
                                {deliveryType === 'express' && renderExpressPicker()}
                            </label>

                            <label className={`${styles.radioRow} ${deliveryType === 'courier' ? styles.radioRowActive : ''}`}>
                                <div className={styles.radioRowTop}>
                                    <input type="radio" {...register('deliveryType')} value="courier" />
                                    <span>Нова Пошта кур'єром</span>
                                    <NpLogo />
                                </div>
                                {deliveryType === 'courier' && renderCourierPicker()}
                            </label>
                        </div>
                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Оплата</h2>
                        <div className={`${styles.paymentGroup} ${paymentMethod === 'cash' ? styles.paymentGroupActive : ''}`}
                            style={{ marginBottom: 8 }}>
                            <label className={`${styles.paymentRow} ${paymentMethod === 'cash' ? styles.paymentRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="cash" />
                                <span>Оплата при отриманні</span>
                            </label>
                        </div>

                        <div className={`${styles.paymentGroup} ${paymentMethod && paymentMethod !== 'cash' ? styles.paymentGroupActive : ''}`}>
                                {PAYMENT_OPTIONS.filter(o => o.value !== 'cash').map(({ value, label }) => (
                                    <label
                                        key={value}
                                        className={`${styles.paymentRow} ${paymentMethod === value ? styles.paymentRowActive : ''}`}
                                    >
                                        <input type="radio" {...register('paymentMethod')} value={value} />
                                        <span>{label}</span>
                                        {value === 'online' && (
                                            <div className={styles.payIcons}>
                                                <img src={visaIcon}       alt="Visa" />
                                                <img src={googlePayIcon}  alt="G Pay" />
                                                <img src={applePayIcon}   alt="A Pay" />
                                                <img src={mastercardIcon} alt="MC" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="button" className={styles.submitBtn} onClick={() => navigate(-1)}>
                            Повернутись
                        </button>
                    </form>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <h3 className={styles.summaryTitle}>Замовлення</h3>
                            <button type="button" className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        </div>

                        <div className={styles.summaryContent}>
                            {cartLoading ? (
                                <div className={styles.summaryLoading}>Завантаження...</div>
                            ) : !hasItems ? (
                                <div className={styles.summaryEmpty}>
                                    <p>Кошик порожній</p>
                                    <a href="/catalog" className={styles.catalogLink}>Перейти до каталогу</a>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.cartItems}>
                                        {cart.items.map(item => (
                                            <div key={item.id} className={styles.cartItem}>
                                                <div className={styles.itemImage}>
                                                    {item.media
                                                        ? <img src={item.media} alt={item.name} />
                                                        : <span style={{ fontSize: 10, color: '#a1a1aa' }}>фото</span>
                                                    }
                                                </div>
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemName}>{item.name}</div>
                                                    <div className={styles.itemPricing}>
                                                        <span className={styles.itemDiscount}>
                                                            {(item.price * 1.1).toLocaleString()} ₴
                                                        </span>
                                                        <span className={styles.itemPrice}>
                                                            {item.price.toLocaleString()} ₴
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.itemQty}>{item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.orderSummary}>
                                        <div className={styles.summaryRow}>
                                            <span>Загальна сума</span>
                                            <span style={{ textDecoration: 'line-through', color: '#a1a1aa' }}>
                                                {(cart.total + savedAmount).toLocaleString()} ₴
                                            </span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Заощаджено</span>
                                            <span className={styles.discount}>- {savedAmount.toLocaleString()} ₴</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Доставка</span>
                                            <span style={{ color: '#a1a1aa' }}>За тарифом перевізника</span>
                                        </div>
                                        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                            <span>Зі знижкою</span>
                                            <span className={styles.totalHighlight}>{cart.total.toLocaleString()} ₴</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {orderError   && <p className={styles.errorMsg}>{orderError}</p>}
                            {orderSuccess && <p className={styles.successMsg}>Замовлення успішно створено!</p>}

                            <button
                                className={styles.checkoutBtn}
                                onClick={handleSubmit(onSubmit)}
                                disabled={orderLoading || !hasItems}
                            >
                                {orderLoading ? 'ОБРОБКА...' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EditCartModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                items={cart.items ?? []}
                total={cart.total}
            />
        </div>
    );
};