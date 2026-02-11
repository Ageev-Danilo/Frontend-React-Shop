import React, { useEffect, useState } from 'react';
import styles from './Catalog.module.css';

import mini from '../../assets/static/mini.png'; 
import minik from '../../assets/static/minik.png'; 
import dj from '../../assets/static/dj.png'; 
import flip from '../../assets/static/flip.png'; 
import thermalxlt160 from '../../assets/static/thermal/thermalxlt160.png'; 

const IMAGES_MAP: Record<string, string> = {
    'minik': minik,
    'dj': dj,
    'flip': flip,
    'thermalxlt160': thermalxlt160,
    'mini': mini, 
};

interface IProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number;
    media: string; 
    categoryId: number; 
}

interface IProductResponse {
    items: IProduct[]; 
    total: number;     
}

const CATEGORY_IDS = {
    DRONES: 1, 
    THERMAL: 2 
};

export function Catalog() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const LIMIT = 12;
    const API_URL = 'http://localhost:8000/api'; 

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const url = new URL(`${API_URL}/products`);
                url.searchParams.append('page', currentPage.toString());
                url.searchParams.append('limit', LIMIT.toString());
                
                if (selectedCategory) {
                    url.searchParams.append('categoryId', selectedCategory.toString());
                }

                const response = await fetch(url.toString());
                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                
                console.log('Отримана відповідь:', data); 

                if (data.items) {
                    setProducts(data.items);
                    setTotalPages(Math.ceil((data.total || 0) / LIMIT));
                }
                else if (data.data) {
                    setProducts(data.data);
                    const total = data.meta?.total || data.total || 0;
                    setTotalPages(Math.ceil(total / LIMIT));
                } 
                else if (Array.isArray(data)) {
                    setProducts(data);
                    setTotalPages(1); 
                }

            } catch (error) {
                console.error("Error fetching products:", error);
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

    const getProductImage = (imgKey: string) => {
        return IMAGES_MAP[imgKey] || minik;
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
                <div style={{textAlign: 'center', padding: '50px'}}>Завантаження...</div>
            ) : (
                <div className={styles.grid}>
                    {products.length > 0 ? (
                        products.map((product) => {
                            const isDiscount = product.oldPrice && product.oldPrice > product.price;

                            return (
                                <div key={product.id} className={styles.card}>
                                    <div className={styles.imageWrapper}>
                                        <img 
                                            src={getProductImage(product.media)} 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <h3 className={styles.cardTitle}>{product.name}</h3>
                                    
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
                                </div>
                            );
                        })
                    ) : (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center'}}>Товарів не знайдено</div>
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