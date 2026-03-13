import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOrders, Order } from '../../shared/api/hooks/useGetOrders';
import { clearAuth } from '../../shared/api/hooks/auth.utils';
import styles from './ProfileOrdersPage.module.css';

const STATUS_LABELS: Record<string, string> = {
    pending:    'Оформлено',
    processing: 'Збирається',
    in_transit: 'У дорозі',
    delivered:  'Доставлено',
    completed:  'Отримано',
};

const PAYMENT_LABELS: Record<string, string> = {
    cash:   'Оплата при отриманні',
    online: 'Онлайн оплата',
    card:   'Карткою онлайн',
    privat: 'Privat Pay',
    apple:  'Apple Pay',
    google: 'Google Pay',
};

const DELIVERY_LABELS: Record<string, string> = {
    warehouse: 'Нова Пошта до відділення',
    postomат:  'Нова Пошта до поштомату',
    express:   'Експрес-доставка',
    courier:   "Нова Пошта кур'єром",
};

type OrderStatus = 'pending' | 'processing' | 'in_transit' | 'delivered' | 'completed';
const STATUS_STEPS: OrderStatus[] = ['pending', 'processing', 'in_transit', 'delivered', 'completed'];

export const ProfileOrdersPage = () => {
    const navigate = useNavigate();
    const { orders, isLoading, error } = useGetOrders();
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const getStatusIndex = (status: string) =>
        STATUS_STEPS.indexOf(status as OrderStatus);

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleLogout = () => {
        clearAuth();
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    };


    const formatDeliveryAddress = (order: Order): string => {
        const parts: string[] = [];

        if (order.deliveryType) {
            parts.push(DELIVERY_LABELS[order.deliveryType] ?? order.deliveryType);
        }
        if (order.city)       parts.push(order.city);
        if (order.warehouse)  parts.push(order.warehouse);
        if (order.street)     parts.push(`вул. ${order.street}`);
        if (order.building)   parts.push(`буд. ${order.building}`);
        if (order.apartment)  parts.push(`кв. ${order.apartment}`);

        return parts.length > 0 ? parts.join(', ') : 'Не вказано';
    };

    const formatPayment = (order: Order): string => {
        if (!order.paymentMethod) return 'Не вказано';
        return PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod;
    };

    const computeSaved = (order: Order): number => {
        if (!order.items || order.items.length === 0) return 0;
        return order.items.reduce((sum, item) => {
            const original = item.oldPrice ?? item.price * 1.1;
            return sum + (original - item.price) * item.quantity;
        }, 0);
    };


    if (isLoading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '100px', width: '100%' }}>
                        Завантаження...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarMainTitle}>ОСОБИСТИЙ КАБІНЕТ</h2>
                    <nav className={styles.nav}>
                        <a href="/profile/contacts" className={styles.navLink}>КОНТАКТНІ ДАНІ</a>
                        <a href="/profile/address"  className={styles.navLink}>АДРЕСА ДОСТАВКИ</a>
                        <a href="/profile/orders"   className={styles.navLinkActive}>МОЇ ЗАМОВЛЕННЯ</a>
                        <div className={styles.divider} />
                        <button className={styles.exitBtn} onClick={handleLogout}>ВИЙТИ</button>
                    </nav>
                </aside>

                <main className={styles.content}>
                    <h1 className={styles.pageTitle}>МОЇ ЗАМОВЛЕННЯ</h1>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>У вас ще немає замовлень</p>
                            <button onClick={() => navigate('/catalog')} className={styles.catalogLink}>
                                ПЕРЕЙТИ ДО КАТАЛОГУ
                            </button>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map((order: Order) => {
                                const savedAmount = computeSaved(order);
                                const total       = order.totalAmount ?? order.total ?? 0;

                                return (
                                    <div
                                        key={order.id}
                                        className={`${styles.orderCard} ${expandedOrderId === order.id ? styles.orderCardExpanded : ''}`}
                                    >
                                        <div
                                            className={styles.orderCardHeader}
                                            onClick={() => toggleOrderExpand(order.id)}
                                        >
                                            <div className={styles.orderHeaderLeft}>
                                                <div
                                                    className={styles.orderStatusDot}
                                                    style={{
                                                        backgroundColor:
                                                            getStatusIndex(order.status) === 4 ? '#10b981' :
                                                            getStatusIndex(order.status) >= 2 ? '#3b82f6' : '#a1a1aa',
                                                    }}
                                                />
                                                <div className={styles.orderInfo}>
                                                    <div className={styles.orderNumber}>
                                                        №{order.orderNumber ?? order.id} від{' '}
                                                        {new Date(order.date ?? order.createdAt).toLocaleDateString('uk-UA')}
                                                    </div>
                                                    <div className={styles.orderStatus}>
                                                        {STATUS_LABELS[order.status] ?? order.status}
                                                    </div>
                                                </div>
                                                <div className={styles.orderMeta}>
                                                    <div className={styles.trackingNum}>
                                                        Номер відправлення<br />
                                                        {order.trackingNumber || 'Буде згодом'}
                                                    </div>
                                                    <div className={styles.orderAmount}>
                                                        Сума замовлення<br />
                                                        {total.toLocaleString()} ₴
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.orderActions}>
                                                {order.items?.[0]?.media && (
                                                    <img
                                                        src={order.items[0].media}
                                                        alt="product"
                                                        className={styles.orderPreviewImg}
                                                    />
                                                )}
                                                <button className={styles.expandBtn}>
                                                    {expandedOrderId === order.id ? '⋀' : '⋁'}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedOrderId === order.id && (
                                            <div className={styles.orderDetails}>

                                                <div className={styles.statusProgress}>
                                                    {STATUS_STEPS.map((step, idx) => (
                                                        <React.Fragment key={step}>
                                                            <div className={`${styles.progressStep} ${getStatusIndex(order.status) >= idx ? styles.progressStepActive : ''}`} />
                                                            {idx < STATUS_STEPS.length - 1 && (
                                                                <div className={`${styles.progressLine} ${getStatusIndex(order.status) > idx ? styles.progressLineActive : ''}`} />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <div className={styles.progressLabels}>
                                                    {STATUS_STEPS.map(step => (
                                                        <span key={step} className={styles.progressLabel}>
                                                            {STATUS_LABELS[step]}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className={styles.detailsSection}>
                                                    <h3 className={styles.sectionTitle}>Інформація про замовлення</h3>
                                                    <div className={styles.detailsGrid}>
                                                        <div className={styles.detailRow}>
                                                            <span className={styles.detailLabel}>Адреса доставки</span>
                                                            <span className={styles.detailValue}>
                                                                {formatDeliveryAddress(order)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span className={styles.detailLabel}>Отримувач</span>
                                                            <div className={styles.recipientInfo}>
                                                                {order.recipient?.name
                                                                    ? <div>{order.recipient.name}</div>
                                                                    : (order.firstName || order.lastName)
                                                                        ? <div>{[order.firstName, order.lastName].filter(Boolean).join(' ')}</div>
                                                                        : <div>—</div>
                                                                }
                                                                <div className={styles.recipientPhone}>
                                                                    {order.recipient?.phone ?? order.phone ?? ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Товари */}
                                                <div className={styles.itemsSection}>
                                                    <table className={styles.itemsTable}>
                                                        <thead>
                                                            <tr>
                                                                <th>Фото</th>
                                                                <th>Назва</th>
                                                                <th>Ціна</th>
                                                                <th>Кількість</th>
                                                                <th>Сума</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items?.map(item => (
                                                                <tr key={item.id}>
                                                                    <td className={styles.itemPhoto}>
                                                                        {item.media && <img src={item.media} alt={item.name} />}
                                                                    </td>
                                                                    <td className={styles.itemName}>{item.name}</td>
                                                                    <td className={styles.itemPrice}>{item.price.toLocaleString()} ₴</td>
                                                                    <td className={styles.itemQty}>{item.quantity}</td>
                                                                    <td className={styles.itemSum}>
                                                                        {(item.price * item.quantity).toLocaleString()} ₴
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    <div className={styles.orderSummary}>
                                                        <div className={styles.summaryRow}>
                                                            <span>Оплата</span>
                                                            <span>{formatPayment(order)}</span>
                                                        </div>
                                                        <div className={styles.summaryRow}>
                                                            <span>Доставка</span>
                                                            <span>За тарифами перевізника</span>
                                                        </div>
                                                        <div className={styles.summaryRow}>
                                                            <span>Загальна сума</span>
                                                            <span>{total.toLocaleString()} ₴</span>
                                                        </div>
                                                        {savedAmount > 0 && (
                                                            <div className={styles.summaryRow}>
                                                                <span>Заощаджено</span>
                                                                <span>{Math.round(savedAmount).toLocaleString()} ₴</span>
                                                            </div>
                                                        )}
                                                        <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                                                            <span>Разом</span>
                                                            <span className={styles.summaryTotal}>
                                                                {total.toLocaleString()} ₴
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button className={styles.cancelBtn}>СКАСУВАТИ</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};