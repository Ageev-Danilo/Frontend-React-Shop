import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCart } from '../../shared/api/hooks/useGetCart';
import { useAddToCart } from '../../shared/api/hooks/useAddToCart';
import styles from './CartModal.module.css';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, anchorRef }) => {
    const navigate = useNavigate();
    const { cart, isLoading, error: cartError, refetch } = useGetCart();
    const { execute: removeFromCart } = useAddToCart();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [position, setPosition]     = useState({ top: 0, right: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPosition({ top: rect.bottom + 12, right: window.innerWidth - rect.right });
        }
    }, [isOpen, anchorRef]);

    useEffect(() => {
        if (isOpen) refetch();
    }, [isOpen]); 

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node) &&
                anchorRef?.current &&
                !anchorRef.current.contains(e.target as Node)
            ) onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose, anchorRef]);

    useEffect(() => {
        if (cart.items) {
            const q: Record<number, number> = {};
            cart.items.forEach(item => { q[item.id] = item.quantity; });
            setQuantities(q);
        }
    }, [cart.items]);

    const handleQuantityChange = (itemId: number, delta: number) => {
        setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] || 1) + delta) }));
    };

    const handleRemoveItem = (itemId: number) => {
        console.log('Remove item:', itemId);
    };

    const handleCheckout = () => { onClose(); navigate('/checkout'); };
    const handleContinueShopping = () => { onClose(); navigate('/catalog'); };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return <div className={styles.loading}>Завантаження...</div>;
        }

        if (cartError) {
            return (
                <div className={styles.errorState}>
                    <p>{cartError}</p>
                    <button
                        className={styles.continueShopping}
                        onClick={() => { onClose(); navigate('/login'); }}
                    >
                        УВІЙТИ В АКАУНТ
                    </button>
                </div>
            );
        }

        if (!cart.items || cart.items.length === 0) {
            return (
                <div className={styles.emptyContainer}>
                    <div className={styles.emptyContent}>
                        <p>Ваш кошик порожній.</p>
                        <p>Почніть вибирати товари, щоб вони з'явилися тут</p>
                    </div>
                    <div className={styles.emptyFooter}>
                        <button className={styles.continueShopping} onClick={handleContinueShopping}>
                            ПРОДОВЖИТИ ПОКУПКИ
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className={styles.items}>
                    {cart.items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemImage}>
                                {item.media && <img src={item.media} alt={item.name} />}
                            </div>
                            <div className={styles.itemDetails}>
                                <div className={styles.itemHeaderRow}>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemControls}>
                                        <button className={styles.circleBtn} onClick={() => handleQuantityChange(item.id, -1)}>−</button>
                                        <span className={styles.quantityValue}>{quantities[item.id] ?? item.quantity}</span>
                                        <button className={styles.circleBtn} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                        <button className={styles.deleteBtn} onClick={() => handleRemoveItem(item.id)} title="Видалити">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.itemPricing}>
                                    <span className={styles.oldPrice}>{(item.price * 1.1).toLocaleString()} ₴</span>
                                    <span className={styles.newPrice}>{item.price.toLocaleString()} ₴</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>Загальна сума</span>
                        <span>{cart.total?.toLocaleString()} ₴</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Заощаджено</span>
                        <span className={styles.discount}>- 1 005 ₴</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                        <span>Зі знижкою</span>
                        <span className={styles.totalPrice}>{cart.total?.toLocaleString()} ₴</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.backBtn} onClick={handleContinueShopping}>
                        ПЕРЕЙТИ ДО КОШИКА
                    </button>
                    <button className={styles.checkoutBtn} onClick={handleCheckout}>
                        ОФОРМИТИ ЗАМОВЛЕННЯ →
                    </button>
                </div>
            </>
        );
    };

    return (
        <div ref={modalRef} className={styles.modal} style={{ top: position.top, right: position.right }}>
            <div className={styles.header}>
                <h2 className={styles.title}>Кошик</h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            {renderContent()}
        </div>
    );
};