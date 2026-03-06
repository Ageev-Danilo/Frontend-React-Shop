import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetCart } from '../../shared/api/hooks/useGetCart';
import { useCreateOrder, CreateOrderData } from '../../shared/api/hooks/useCreateOrder';
import styles from './CheckoutPage.module.css';

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, isLoading: cartLoading } = useGetCart();
    const { execute: createOrder, isLoading: orderLoading, error: orderError } = useCreateOrder();
    const [orderSuccess, setOrderSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateOrderData>();

    const onSubmit = async (data: CreateOrderData) => {
        const result = await createOrder(data);
        if (result) {
            setOrderSuccess(true);
            setTimeout(() => {
                navigate(`/profile/orders`);
            }, 2000);
        }
    };

    if (cartLoading) {
        return (
            <div className={styles.wrapper}>
                <div style={{ textAlign: 'center', padding: '100px' }}>Завантаження...</div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Оформлення замовлення</h1>
                <div className={styles.emptyCart}>
                    <p>Ваш кошик порожній</p>
                    <a href="/catalog" className={styles.backLink}>ПЕРЕЙТИ ДО КАТАЛОГУ</a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Оформлення замовлення</h1>

            <div className={styles.container}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Ваші контактні дані</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Прізвище</label>
                            <input
                                {...register('lastName', { required: "Обов'язкове поле" })}
                                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                                placeholder="Ваше Прізвище"
                            />
                            {errors.lastName && <span className={styles.errorMsg}>{errors.lastName.message}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Ім'я</label>
                            <input
                                {...register('firstName', { required: "Обов'язкове поле" })}
                                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                                placeholder="Ваше Ім'я"
                            />
                            {errors.firstName && <span className={styles.errorMsg}>{errors.firstName.message}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>По батькові</label>
                            <input
                                {...register('patronymic', { required: "Обов'язкове поле" })}
                                className={`${styles.input} ${errors.patronymic ? styles.inputError : ''}`}
                                placeholder="По батькові"
                            />
                            {errors.patronymic && <span className={styles.errorMsg}>{errors.patronymic.message}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Телефон</label>
                            <input
                                {...register('phone', { required: "Обов'язкове поле" })}
                                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                placeholder="+ 38 0"
                            />
                            {errors.phone && <span className={styles.errorMsg}>{errors.phone.message}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>E-mail</label>
                            <input
                                {...register('email', {
                                    required: "Обов'язкове поле",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Невірний email' }
                                })}
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                placeholder="Ваш E-mail"
                            />
                            {errors.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Коментар до замовлення</label>
                            <textarea
                                {...register('comment')}
                                className={`${styles.textarea} ${errors.comment ? styles.inputError : ''}`}
                                placeholder="Що б ви хотіли уточнити"
                                rows={5}
                            />
                        </div>
                    </form>
                </div>
                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <h3 className={styles.summaryTitle}>Замовлення</h3>
                            <button className={styles.editBtn}>✏️</button>
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
                                            <span className={styles.itemPrice}>{item.price.toLocaleString()} ₴</span>
                                            {item.quantity > 1 && (
                                                <span className={styles.itemDiscount}>{(item.price * 1.1).toLocaleString()} ₴</span>
                                            )}
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
                            <div className={styles.summaryRow + ' ' + styles.summaryTotal}>
                                <span>Разом</span>
                                <span>{cart.total.toLocaleString()} ₴</span>
                            </div>
                        </div>

                        {orderError && <p className={styles.errorMsg}>{orderError}</p>}
                        {orderSuccess && <p className={styles.successMsg}>Замовлення успішно створено!</p>}

                        <button
                            className={styles.submitBtn}
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