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

type OrderStatus = 'pending' | 'processing' | 'in_transit' | 'delivered' | 'completed';
const STATUS_STEPS: OrderStatus[] = ['pending', 'processing', 'in_transit', 'delivered', 'completed'];

export const ProfileOrdersPage = () => {
    const navigate = useNavigate();
    const { orders, isLoading, error } = useGetOrders();
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const getStatusIndex = (status: string) =>
        STATUS_STEPS.indexOf(status as OrderStatus);

    const handleLogout = () => {
        clearAuth();
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    };

    const sidebar = (
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
    );

    if (isLoading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    {sidebar}
                    <main className={styles.content}>
                        <h1 className={styles.pageTitle}>МОЇ ЗАМОВЛЕННЯ</h1>
                        <div style={{ textAlign: 'center', padding: '100px' }}>Завантаження...</div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    {sidebar}
                    <main className={styles.content}>
                        <h1 className={styles.pageTitle}>МОЇ ЗАМОВЛЕННЯ</h1>
                        <div className={styles.emptyState}>
                            <p className={styles.errorMsg}>{error}</p>
                            <button onClick={() => navigate('/login')} className={styles.catalogLink}>
                                УВІЙТИ В АКАУНТ
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {sidebar}
                <main className={styles.content}>
                    <h1 className={styles.pageTitle}>МОЇ ЗАМОВЛЕННЯ</h1>

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
                                const status      = order.deliveryStatus ?? 'pending';
                                const total       = order.totalPrice ?? 0;
                                const payment     = order.payment
                                    ? (PAYMENT_LABELS[order.payment] ?? order.payment)
                                    : 'Не вказано';
                                const isExpanded  = expandedOrderId === order.id;

                                return (
                                    <div
                                        key={order.id}
                                        className={`${styles.orderCard} ${isExpanded ? styles.orderCardExpanded : ''}`}
                                    >
                                        <div
                                            className={styles.orderCardHeader}
                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                        >
                                            <div className={styles.orderHeaderLeft}>
                                                <div
                                                    className={styles.orderStatusDot}
                                                    style={{
                                                        backgroundColor:
                                                            getStatusIndex(status) === 4 ? '#10b981' :
                                                            getStatusIndex(status) >= 2 ? '#3b82f6' : '#a1a1aa',
                                                    }}
                                                />
                                                <div className={styles.orderInfo}>
                                                    <div className={styles.orderNumber}>
                                                        №{order.orderNumber ?? order.id}
                                                        {order.createdAt && (
                                                            <> від {new Date(order.createdAt).toLocaleDateString('uk-UA')}</>
                                                        )}
                                                    </div>
                                                    <div className={styles.orderStatus}>
                                                        {STATUS_LABELS[status] ?? status}
                                                    </div>
                                                </div>
                                                <div className={styles.orderMeta}>
                                                    <div className={styles.trackingNum}>
                                                        Номер відправлення<br />
                                                        {order.trackingNumber || 'Буде згодом'}
                                                    </div>
                                                    <div className={styles.orderAmount}>
                                                        Сума замовлення<br />
                                                        {total > 0 ? `${total.toLocaleString()} ₴` : 'Не вказано'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.orderActions}>
                                                <button className={styles.expandBtn}>
                                                    {isExpanded ? '⋀' : '⋁'}
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className={styles.orderDetails}>

                                                <div className={styles.statusProgress}>
                                                    {STATUS_STEPS.map((step, idx) => (
                                                        <React.Fragment key={step}>
                                                            <div className={`${styles.progressStep} ${getStatusIndex(status) >= idx ? styles.progressStepActive : ''}`} />
                                                            {idx < STATUS_STEPS.length - 1 && (
                                                                <div className={`${styles.progressLine} ${getStatusIndex(status) > idx ? styles.progressLineActive : ''}`} />
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
                                                            <span className={styles.detailLabel}>Оплата</span>
                                                            <span className={styles.detailValue}>{payment}</span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span className={styles.detailLabel}>Коментар</span>
                                                            <span className={styles.detailValue}>
                                                                {order.comment || 'Без коментаря'}
                                                            </span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span className={styles.detailLabel}>Доставка</span>
                                                            <span className={styles.detailValue}>За тарифами перевізника</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.orderSummary}>
                                                    <div className={styles.summaryRow}>
                                                        <span>Загальна сума</span>
                                                        <span>{total > 0 ? `${total.toLocaleString()} ₴` : '—'}</span>
                                                    </div>
                                                    <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                                                        <span>Разом</span>
                                                        <span className={styles.summaryTotal}>
                                                            {total > 0 ? `${total.toLocaleString()} ₴` : '—'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button className={styles.cancelBtn}>СКАСУВАТИ</button>
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