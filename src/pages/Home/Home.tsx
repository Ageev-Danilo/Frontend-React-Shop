import { Button } from '../../shared/button';
import mini from '../../assets/static/mini.png';
import minik from '../../assets/static/minik.png';
import styles from './Home.module.css';
import base from '../../shared/base/styles.module.css';
import '../../assets/fonts/font.css';

import { useGetNewProducts } from '../../shared/api/hooks/useGetNewProducts';
import { useGetPopularProducts } from '../../shared/api/hooks/useGetPopularProducts';

export function Home() {
    const { 
        products: newProducts, 
        isLoading: isNewLoading, 
        error: newError 
    } = useGetNewProducts();

    const { 
        products: popularProducts, 
        isLoading: isPopularLoading, 
        error: popularError 
    } = useGetPopularProducts();

    // Масив стилів для фонів карток (якщо товарів більше 3, буде йти по колу)
    const bgClasses = [styles.first, styles.second, styles.third];

    return (
        <div className={styles.wrapper}>
            {/* Секція ПРО НАС */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h2 className={styles.sectionTitle}>Про нас</h2>
                    <p className={styles.aboutText}>
                        Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                    </p>
                    <Button 
                        className={styles.moreBtn} 
                        type='outline' 
                        icon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>' 
                        pos='right'
                    >
                        Читати більше
                    </Button>
                </div>
            </section>

            {/* Секція НОВЕ НА САЙТІ */}
            <section className={styles.newSection}>
                <h2 className={styles.sectionTitle}>Нове на сайті</h2>
                
                {isNewLoading && <p className={styles.statusMsg}>Завантаження новинок...</p>}
                {newError && <p className={styles.errorMsg}>Помилка: {newError}</p>}

                <div className={styles.newGrid}>
                    {!isNewLoading && !newError && newProducts.slice(0, 3).map((product, index) => (
                        <div key={product.id} className={`${styles.droneCard} ${bgClasses[index % 3]}`}>
                            <div className={styles.imageContainer}>
                                <img 
                                    src={product.media ? product.media : minik} 
                                    alt={product.name} 
                                    className={styles.droneImg} 
                                />
                            </div>
                            <div className={styles.cardInfo}>
                                <h3>{product.name}</h3>
                                <div className={styles.cardBottom}>
                                    <span className={styles.cardPrice}>{product.price} ₴</span>
                                    <Button className={styles.buyBtn} type='outline'>Купити</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Секція КАТАЛОГ */}
            <section className={styles.catalogSection}>
                <h2 className={styles.sectionTitle}>Каталог</h2>
                
                {isPopularLoading && <p className={styles.statusMsg}>Завантаження каталогу...</p>}
                
                <div className={styles.catalogGrid}>
                    {!isPopularLoading && !popularError && popularProducts.map((product) => (
                        <div key={product.id} className={styles.catalogItem}>
                            <div className={styles.itemImageBg}>
                                <img src={product.media ? product.media : mini} alt={product.name} />
                            </div>
                            <div className={styles.itemDetails}>
                                <p className={styles.itemName}>{product.name}</p>
                                <div className={styles.itemPrices}>
                                    <span className={styles.oldPrice}>{Math.round(product.price * 1.1)} ₴</span>
                                    <span className={styles.currentPrice}>{product.price} ₴</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.viewMoreContainer}>
                    <Button 
                        className={styles.allBtn} 
                        icon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white"/></svg>'
                        pos='right'
                    >
                        Дивитись всі
                    </Button>
                </div>
            </section>
        </div>
    );
}