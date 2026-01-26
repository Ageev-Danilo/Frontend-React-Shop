import React from 'react';
import { Link } from 'react-router-dom';

import droneImg from '../../assets/img/drone.png';
import mini from '../../assets/static/mini.png';
import minik from '../../assets/static/minik.png';
import flip from '../../assets/static/flip.png';
import dj from '../../assets/static/dj.png';

import { Button } from '../../shared/button';
import styles from './Home.module.css';
import '../../assets/fonts/font.css';

import { useGetNewProducts } from '../../shared/api/hooks/useGetNewProducts';
import { useGetPopularProducts } from '../../shared/api/hooks/useGetPopularProducts';

export function Home() {
    const { products: newProducts, isLoading: isNewLoading, error: newError } = useGetNewProducts();
    const { products: popularProducts, isLoading: isPopularLoading, error: popularError } = useGetPopularProducts();

    return (
        <div className={styles.wrapper}>
            <img src={droneImg} alt="Drone Hero" />
            <div className={styles.bottomHeader}>
                <div className={styles.description}>
                    <div className={styles.textsP}>
                        <p>Передові технології в одному місці.<br />Обирай найкраще для найважливішого.</p>
                    </div>
                    <Link to="/posts">
                        <Button>До каталогу</Button>
                    </Link>
                </div>
                <div className={styles.bottomBackground}></div>
            </div>

            <div className="about">
                <h2>Про нас</h2>
                <p>
                    Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                </p>
                <Button className="view-btn">Читати більше</Button>
            </div>

            <div className="new">
                <h2>Нове на сайті</h2>
                
                {isNewLoading && <div>Loading new products...</div>}
                {newError && <div>Error occured. Try again later. <p>Error message: {newError}</p></div>}

                {!isNewLoading && !newError && (
                    <div className={styles.row}>
                        {newProducts.map((product) => (
                            <div className="drone" key={product.id}>
                                <img src={product.media || minik} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description?.slice(0, 50)}...</p>
                                <div>
                                    from ${product.price}
                                    <Button className="buy-btn" type='outline'>Купити</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="catalog">
                <h2>Каталог</h2>

                {isPopularLoading && <div>Loading catalog...</div>}
                {popularError && <div>Error occured. Try again later. <p>Error message: {popularError}</p></div>}

                {!isPopularLoading && !popularError && (
                    <div className={styles.row}>
                        {popularProducts.map((product) => (
                            <div className="drone" key={product.id}>
                                <img src={product.media || mini} alt={product.name} />
                                <p>{product.name}</p>
                                <s>{product.price + 500} ₴</s> 
                                <p className="discount">{product.price} ₴</p>
                            </div>
                        ))}
                    </div>
                )}
                
                <Link to="/posts">
                    <Button className="view-more-btn">Дивитись всі</Button>
                </Link>
            </div>
        </div>
    );
}