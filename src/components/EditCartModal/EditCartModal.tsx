import React, { useEffect, useRef, useState } from 'react';
import styles from './EditCartModal.module.css';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    media?: string;
}

interface EditCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
}

export const EditCartModal: React.FC<EditCartModalProps> = ({ isOpen, onClose, items, total }) => {
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (items) {
            const q: Record<number, number> = {};
            items.forEach(item => { q[item.id] = item.quantity; });
            setQuantities(q);
        }
    }, [items]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    const handleQuantityChange = (itemId: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
        }));
    };

    const handleRemove = (itemId: number) => {
        setQuantities(prev => {
            const next = { ...prev };
            delete next[itemId];
            return next;
        });
    };

    const visibleItems = items.filter(item => quantities[item.id] !== undefined);

    const computedTotal = visibleItems.reduce(
        (sum, item) => sum + item.price * (quantities[item.id] ?? item.quantity),
        0
    );
    const savedAmount = 1005;

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} ref={overlayRef} onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Редагувати товари</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.items}>
                    {visibleItems.map(item => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemImage}>
                                {item.media && <img src={item.media} alt={item.name} />}
                            </div>
                            <div className={styles.itemDetails}>
                                <div className={styles.itemName}>{item.name}</div>
                                <div className={styles.itemPricing}>
                                    <span className={styles.oldPrice}>{(item.price * 1.1).toLocaleString()} ₴</span>
                                    <span className={styles.newPrice}>{item.price.toLocaleString()} ₴</span>
                                </div>
                            </div>
                            <div className={styles.itemControls}>
                                <button className={styles.circleBtn} onClick={() => handleQuantityChange(item.id, -1)}>−</button>
                                <span className={styles.qty}>{quantities[item.id] ?? item.quantity}</span>
                                <button className={styles.circleBtn} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                <button className={styles.deleteBtn} onClick={() => handleRemove(item.id)} title="Видалити">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>Загальна сума</span>
                        <span className={styles.oldTotal}>{(computedTotal * 1.1 - savedAmount + savedAmount).toLocaleString()} ₴</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Заощаджено</span>
                        <span className={styles.saved}>- {savedAmount.toLocaleString()} ₴</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                        <span>Зі знижкою</span>
                        <span className={styles.total}>{computedTotal.toLocaleString()} ₴</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>СКАСУВАТИ</button>
                    <button className={styles.saveBtn} onClick={onClose}>ЗБЕРЕГТИ</button>
                </div>
            </div>
        </div>
    );
};