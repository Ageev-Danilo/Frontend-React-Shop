import { Button } from '../../shared/button';

import mini from '../../assets/static/mini.png';
import minik from '../../assets/static/minik.png';
import flip from '../../assets/static/flip.png';

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

    return (
        <div className={styles.wrapper}>
            <div className={styles.about + ' ' + base.column}>
                <h2 className={base.title}>Про нас</h2>
                <p>
                    Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                </p>
                <Button className="view-btn" type='outline' 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#0C122A" style="fill:#0C122A;fill:color(display-p3 0.0471 0.0706 0.1647);fill-opacity:1;"/></svg>' 
                    pos='right'>
                    Читати більше
                </Button>
            </div>

            <div>
                <h2 className={base.title}>Нове на сайті</h2>
                
                {isNewLoading && <p style={{textAlign: 'center'}}>Завантаження новинок...</p>}
                {newError && <p style={{textAlign: 'center', color: 'red'}}>Помилка: {newError}</p>}

                <div className={`${base.row} ${styles.new}`}>
                    {!isNewLoading && !newError && newProducts.map((product) => (
                        <div key={product.id} className={styles.dronePrev + ' ' + base.column}>
                            <img src={product.media } alt={product.name} style={{maxHeight: '200px', objectFit: 'contain'}} />
                            {/* ? product.media : minik */}
                            <div>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <Button className="buy-btn" type='outline'>Купити</Button>
                            </div>
                        </div>
                    ))}
                    
                    {!isNewLoading && !newError && newProducts.length === 0 && (
                        <p>Товарів поки немає</p>
                    )}
                </div>
            </div>

            <div className={styles.catalog + ' ' + base.column}>
                <h2 className={base.title}>Каталог</h2>
                {isPopularLoading && <p>Завантаження каталогу...</p>}
                {popularError && <p style={{color: 'red'}}>Error: {popularError}</p>}

                <div className={base.row} style={{flexWrap: 'wrap', justifyContent: 'center', gap: '20px'}}>
                    {!isPopularLoading && !popularError && popularProducts.map((product) => (
                        <div key={product.id} className="drone" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <img src={product.media ? product.media : mini} alt={product.name} style={{width: '150px'}} />
                            <p>{product.name}</p>
                            <s>{Math.round(product.price * 1.1)} ₴</s>
                            <p className="discount">{product.price} ₴ </p>
                        </div>
                    ))}
                </div>

                <Button className="view-more-btn" 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white" style="fill:white;fill-opacity:1;"/></svg>'
                    pos='right'>
                    Дивитись всі
                </Button>
            </div>
        </div>
    );
};