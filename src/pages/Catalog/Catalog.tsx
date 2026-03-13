import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Catalog.module.css';
import { useAddToCart } from '../../shared/api/hooks/useAddToCart';

import minik          from '../../assets/static/minik.png';
import dj             from '../../assets/static/dj.png';
import thermalxlt160  from '../../assets/static/thermal/thermalxlt160.png';
import { API_URL }    from '../../shared/api/api-url';

interface IProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number;
    media: string;
    categoryId: number;
}

const CATEGORY_IDS = { DRONES: 1, THERMAL: 2 };
const LIMIT = 12;

export function Catalog() {
    const navigate = useNavigate();
    const { execute: addToCart, error: cartError } = useAddToCart();

    const [products, setProducts]           = useState<IProduct[]>([]);
    const [isLoading, setIsLoading]         = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage]     = useState(1);
    const [totalPages, setTotalPages]       = useState(1);

    const [cardStates, setCardStates] = useState<Record<number, 'idle' | 'loading' | 'added' | 'error'>>({});
    const [cardErrors, setCardErrors] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let url: URL;
                if (selectedCategory !== null) {
                    url = new URL(`${API_URL}/products/same-category/${selectedCategory}`);
                } else {
                    url = new URL(`${API_URL}/products`);
                }
                url.searchParams.append('page', currentPage.toString());
                url.searchParams.append('limit', LIMIT.toString());

                const response = await fetch(url.toString());
                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                if (data.items) {
                    setProducts(data.items);
                    setTotalPages(Math.ceil((data.total || 0) / LIMIT));
                } else if (data.data) {
                    setProducts(data.data);
                    setTotalPages(Math.ceil((data.meta?.total || data.total || 0) / LIMIT));
                } else if (Array.isArray(data)) {
                    setProducts(data);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, selectedCategory]);

    const handleCategoryChange = (catId: number | null) => {
        if (selectedCategory !== catId) {
            setSelectedCategory(catId);
            setCurrentPage(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
        setCardStates(prev => ({ ...prev, [productId]: 'loading' }));
        setCardErrors(prev => ({ ...prev, [productId]: '' }));

        const result = await addToCart({ productId, quantity: 1 });

        if (result) {
            setCardStates(prev => ({ ...prev, [productId]: 'added' }));
            setTimeout(() => setCardStates(prev => ({ ...prev, [productId]: 'idle' })), 2000);
        } else {
            const msg = cartError || 'Помилка';
            setCardErrors(prev => ({ ...prev, [productId]: msg }));
            setCardStates(prev => ({ ...prev, [productId]: 'error' }));
            setTimeout(() => {
                setCardStates(prev => ({ ...prev, [productId]: 'idle' }));
                setCardErrors(prev => ({ ...prev, [productId]: '' }));
            }, 3000);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Каталог</h1>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${selectedCategory === null ? styles.active : ''}`}
                    onClick={() => handleCategoryChange(null)}
                >
                    Всі
                </button>
                <button
                    className={`${styles.filterBtn} ${selectedCategory === CATEGORY_IDS.DRONES ? styles.active : ''}`}
                    onClick={() => handleCategoryChange(CATEGORY_IDS.DRONES)}
                >
                    <img src={dj} alt="Дрони" className={styles.filterImg} />
                </button>
                <button
                    className={`${styles.filterBtn} ${selectedCategory === CATEGORY_IDS.THERMAL ? styles.active : ''}`}
                    onClick={() => handleCategoryChange(CATEGORY_IDS.THERMAL)}
                >
                    <img src={thermalxlt160} alt="Тепловізори" className={styles.filterImg} />
                </button>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження...</div>
            ) : (
                <div className={styles.grid}>
                    {products.length > 0 ? products.map((product) => {
                        const isDiscount = product.oldPrice && product.oldPrice > product.price;
                        const cardState  = cardStates[product.id] || 'idle';
                        const cardError  = cardErrors[product.id] || '';

                        return (
                            <div key={product.id} className={styles.card}>
                                <div
                                    className={styles.imageWrapper}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={product.media || minik}
                                        alt={product.name}
                                        onError={(e) => { (e.target as HTMLImageElement).src = minik; }}
                                    />
                                </div>

                                <h3
                                    className={styles.cardTitle}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {product.name}
                                </h3>

                                <div className={styles.priceRow}>
                                    {isDiscount && (
                                        <span className={styles.oldPrice}>
                                            {product.oldPrice?.toLocaleString()} ₴
                                        </span>
                                    )}
                                    <span className={`${styles.price} ${isDiscount ? styles.priceRed : ''}`}>
                                        {product.price.toLocaleString()} ₴
                                    </span>
                                </div>

                                <button
                                    className={styles.addToCartBtn}
                                    onClick={(e) => handleAddToCart(e, product.id)}
                                    disabled={cardState === 'loading'}
                                >
                                    {cardState === 'loading' && 'ДОДАЄТЬСЯ...'}
                                    {cardState === 'added'   && 'ДОДАНО ✓'}
                                    {(cardState === 'idle' || cardState === 'error') && 'В КОШИК'}
                                </button>

                                {cardState === 'error' && cardError && (
                                    <p className={styles.cardError}>{cardError}</p>
                                )}
                            </div>
                        );
                    }) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            Товарів не знайдено
                        </div>
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className={styles.pageBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}