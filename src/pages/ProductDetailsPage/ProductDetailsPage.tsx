import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductById } from '../../shared/api/hooks/useGetProductById';
import styles from './ProductDetailsPage.module.css';

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error } = useGetProductById(id);

    if (isLoading) return <div className={styles.loader}>Завантаження продукту...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!product) return <div className={styles.error}>Продукт не знайдено</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <nav className={styles.breadcrumbs}>
                    <span>КАТАЛОГ</span> / <span>{product.category?.name || 'ТОВАРИ'}</span> / <b>{product.name}</b>
                </nav>

                <div className={styles.mainContent}>
                    <div className={styles.imageSection}>
                        <div className={styles.mainImageHolder}>
                            <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} />
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.sku}>АРТИКУЛ: {product.id.slice(0, 8)}</p>
                        
                        <div className={styles.priceContainer}>
                            <span className={styles.price}>{product.price} ₴</span>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.buyBtn}>ДОДАТИ У КОШИК</button>
                            <button className={styles.wishlistBtn}>♡</button>
                        </div>

                        <div className={styles.shortDescription}>
                            <h3>ОПИС</h3>
                            <p>{product.description || 'Опис відсутній'}</p>
                        </div>
                    </div>
                </div>

                <section className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>ХАРАКТЕРИСТИКИ</h2>
                    <div className={styles.specGrid}>
                        <div className={styles.specRow}>
                            <span>Категорія</span>
                            <span>{product.category?.name || 'Загальна'}</span>
                        </div>
                        {/* ... */}                        
                    </div>
                </section>
            </div>
        </div>
    );
};