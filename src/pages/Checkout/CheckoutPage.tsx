import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetCart } from '../../shared/api/hooks/useGetCart';
import { useCreateOrder, CreateOrderData } from '../../shared/api/hooks/useCreateOrder';
import styles from './CheckoutPage.module.css';

interface NovaPoshtaCity {
    Ref: string;
    Description: string;
    AreaDescription: string;
}

interface NovaPoshtaWarehouse {
    Ref: string;
    Description: string;
    ShortAddress: string;
    Number: string;
}

const WAREHOUSE_TYPE = '841339c7-591a-42e2-8233-7a0a00f7a000';
const POSTOMАТ_TYPE  = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0';

const NP_API_KEY = process.env.REACT_APP_NOVA_POSHTA_API_KEY ?? '';
const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

const QUICK_CITIES = ['Вінниця', 'Одеса', 'Харків', 'Дніпро', 'Київ', 'Львів'];

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

interface CheckoutFormData extends CreateOrderData {
    deliveryType: 'postomат' | 'warehouse' | 'express' | 'courier';
    paymentMethod: 'cash' | 'online' | 'card' | 'privat' | 'apple' | 'google';
}

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, isLoading: cartLoading } = useGetCart();
    const { execute: createOrder, isLoading: orderLoading, error: orderError } = useCreateOrder();
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [cityInput, setCityInput]           = useState('');
    const [cityOptions, setCityOptions]       = useState<NovaPoshtaCity[]>([]);
    const [selectedCity, setSelectedCity]     = useState<NovaPoshtaCity | null>(null);
    const [showCityList, setShowCityList]     = useState(false);
    const [warehouseInput, setWarehouseInput] = useState('');
    const [warehouseOptions, setWarehouseOptions] = useState<NovaPoshtaWarehouse[]>([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
    const [showWarehouseList, setShowWarehouseList]   = useState(false);
    const [selectedWarehouse, setSelectedWarehouse]   = useState<NovaPoshtaWarehouse | null>(null);
    const [npLoading, setNpLoading] = useState(false);
    const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
        defaultValues: {
            deliveryType: 'warehouse',
            paymentMethod: 'online',
        },
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
        setSelectedWarehouse(null);
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
        fetchCities(name).then(list => {
            if (list.length > 0) handleCitySelect(list[0]);
        });
    };

    const handleWarehouseSelect = (wh: NovaPoshtaWarehouse) => {
        setSelectedWarehouse(wh);
        setWarehouseInput(wh.Description);
        setShowWarehouseList(false);
    };

    const onSubmit = async (data: CheckoutFormData) => {
        const orderData: CreateOrderData = {
            firstName:  data.firstName,
            lastName:   data.lastName,
            patronymic: data.patronymic,
            phone:      data.phone,
            email:      data.email,
            comment:    data.comment,
        };
        const result = await createOrder(orderData);
        if (result) {
            setOrderSuccess(true);
            setTimeout(() => navigate('/profile/orders'), 2000);
        }
    };

    if (cartLoading) return (
        <div className={styles.wrapper}>
            <div style={{ textAlign: 'center', padding: '100px' }}>Завантаження...</div>
        </div>
    );

    if (!cart.items || cart.items.length === 0) return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Оформлення замовлення</h1>
            <div className={styles.emptyCart}>
                <p>Ваш кошик порожній</p>
                <a href="/catalog" className={styles.backLink}>ПЕРЕЙТИ ДО КАТАЛОГУ</a>
            </div>
        </div>
    );

    const needsLocationPicker = deliveryType === 'warehouse' || deliveryType === 'postomат';

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Оформити замовлення</h1>

            <div className={styles.container}>
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Ваші контактні дані</h2>

                            {[
                                { name: 'lastName',   label: 'Прізвище',  placeholder: 'Ваше Прізвище' },
                                { name: 'firstName',  label: "Ім'я",      placeholder: "Ваше Ім'я" },
                                { name: 'patronymic', label: 'По батькові', placeholder: 'По батькові' },
                                { name: 'phone',      label: 'Телефон',   placeholder: '+ 38 0' },
                                { name: 'email',      label: 'E-mail',    placeholder: 'Ваш E-mail' },
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
                                </div>
                            ))}

                            <div className={styles.field}>
                                <label className={styles.label}>Коментар до замовлення</label>
                                <textarea
                                    {...register('comment')}
                                    className={styles.textarea}
                                    placeholder="Що б ви хотіли уточнити"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Доставка</h2>

                            <label className={`${styles.radioRow} ${deliveryType === 'postomат' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('deliveryType')} value="postomат" />
                                <span>Нова Пошта до поштомату</span>
                                <img className={styles.npLogo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nova_Poshta_2014_logo.svg/200px-Nova_Poshta_2014_logo.svg.png" alt="NP" />
                            </label>

                            <label className={`${styles.radioRow} ${deliveryType === 'warehouse' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('deliveryType')} value="warehouse" />
                                <span>Нова Пошта до відділення</span>
                                <img className={styles.npLogo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nova_Poshta_2014_logo.svg/200px-Nova_Poshta_2014_logo.svg.png" alt="NP" />
                            </label>

                            {needsLocationPicker && (
                                <div className={styles.npPicker}>
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
                                        {showCityList && (
                                            <ul className={styles.dropdown}>
                                                {cityOptions.map(c => (
                                                    <li key={c.Ref} onMouseDown={() => handleCitySelect(c)}>
                                                        {c.Description} <span className={styles.dropdownSub}>{c.AreaDescription} обл.</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className={styles.quickCities}>
                                        {QUICK_CITIES.map(name => (
                                            <button key={name} type="button" className={styles.quickCity} onClick={() => handleQuickCity(name)}>
                                                {name}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedCity && (
                                        <div className={styles.field} style={{ position: 'relative' }}>
                                            <label className={styles.label}>
                                                {deliveryType === 'postomат' ? 'Поштомат' : 'Відділення'}
                                            </label>
                                            <input
                                                className={styles.input}
                                                value={warehouseInput}
                                                placeholder={npLoading ? 'Завантаження...' : `Пошук ${deliveryType === 'postomат' ? 'поштомату' : 'відділення'}...`}
                                                autoComplete="off"
                                                disabled={npLoading}
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
                                    )}
                                </div>
                            )}

                            <label className={`${styles.radioRow} ${deliveryType === 'express' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('deliveryType')} value="express" />
                                <span>Експрес-доставка по Києву</span>
                            </label>

                            <label className={`${styles.radioRow} ${deliveryType === 'courier' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('deliveryType')} value="courier" />
                                <span>Нова Пошта кур'єром</span>
                                <img className={styles.npLogo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nova_Poshta_2014_logo.svg/200px-Nova_Poshta_2014_logo.svg.png" alt="NP" />
                            </label>
                        </div>

                        <div className={styles.formBlock}>
                            <h2 className={styles.blockTitle}>Оплата</h2>

                            <label className={`${styles.radioRow} ${paymentMethod === 'cash' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="cash" />
                                <span>Оплата при отриманні</span>
                            </label>

                            <label className={`${styles.radioRow} ${paymentMethod === 'online' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="online" />
                                <span>Оплатити зараз</span>
                                {paymentMethod === 'online' && (
                                    <div className={styles.payIcons}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/200px-Google_Pay_Logo.svg.png" alt="Google Pay" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/200px-Apple_Pay_logo.svg.png" alt="Apple Pay" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" />
                                    </div>
                                )}
                            </label>

                            <label className={`${styles.radioRow} ${paymentMethod === 'card' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="card" />
                                <span>Карткою онлайн</span>
                            </label>

                            <label className={`${styles.radioRow} ${paymentMethod === 'privat' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="privat" />
                                <span>Privat Pay</span>
                            </label>

                            <label className={`${styles.radioRow} ${paymentMethod === 'apple' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="apple" />
                                <span>Apple Pay</span>
                            </label>

                            <label className={`${styles.radioRow} ${paymentMethod === 'google' ? styles.radioRowActive : ''}`}>
                                <input type="radio" {...register('paymentMethod')} value="google" />
                                <span>Google Pay</span>
                            </label>
                        </div>

                        <button type="button" className={styles.submitBtn} onClick={() => navigate(-1)}>
                            ПОВЕРНУТИСЬ
                        </button>
                    </form>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <h3 className={styles.summaryTitle}>Замовлення</h3>
                            <button type="button" className={styles.editBtn} onClick={() => navigate('/catalog')}>✏️</button>
                        </div>

                        <div className={styles.cartItems}>
                            {cart.items.map((item) => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        {item.media && <img src={item.media} alt={item.name} />}
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemName}>{item.name}</div>
                                        <div className={styles.itemPricing}>
                                            {item.quantity > 1 && (
                                                <span className={styles.itemDiscount}>{(item.price * 1.1).toLocaleString()} ₴</span>
                                            )}
                                            <span className={styles.itemPrice}>{item.price.toLocaleString()} ₴</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemQty}>{item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderSummary}>
                            <div className={styles.summaryRow}>
                                <span>Загальна сума</span>
                                <span>{cart.total.toLocaleString()} ₴</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Заощаджено</span>
                                <span className={styles.discount}>- 1 005 ₴</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Доставка</span>
                                <span>За тарифом перевізника</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Зі знижкою</span>
                                <span className={styles.totalHighlight}>{cart.total.toLocaleString()} ₴</span>
                            </div>
                        </div>

                        {orderError   && <p className={styles.errorMsg}>{orderError}</p>}
                        {orderSuccess && <p className={styles.successMsg}>Замовлення успішно створено!</p>}

                        <button
                            className={styles.checkoutBtn}
                            onClick={handleSubmit(onSubmit)}
                            disabled={orderLoading}
                        >
                            {orderLoading ? 'ОБРОБКА...' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};