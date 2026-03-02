import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetailsPage.module.css';

import dronImg       from '../../assets/static/product_page/dron.png';
import cameraImg     from '../../assets/static/product_page/camera.png';
import forVideoImg   from '../../assets/static/product_page/for video.png';
import inAirImg      from '../../assets/static/product_page/in air.png';
import storage512Img from '../../assets/static/product_page/512gb.png';
import bgOval        from '../../assets/img/bg.svg';

import { useGetProductById } from '../../shared/api/hooks/useGetProductById';


const useGetSimilarProducts = (id: string | undefined) => {
    const [similar, setSimilar] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) { setIsLoading(false); return; }
        const fetchSimilar = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`http://localhost:8000/products/same/${id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setSimilar(Array.isArray(data) ? data : data.items ?? data.data ?? []);
            } catch {
                setSimilar([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSimilar();
    }, [id]);

    return { similar, isLoading };
};


export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { product, isLoading, error } = useGetProductById(id);
    const { similar } = useGetSimilarProducts(id);
    const [cartAdded, setCartAdded] = useState(false);

    if (isLoading) return <div className={styles.loader}><span>Завантаження...</span></div>;
    if (error || !product) return <div className={styles.error}>Продукт не знайдено</div>;

    const handleBuy = () => {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
    };

    const productImg = product.media || product.imageUrl || dronImg;

    return (
        <div className={styles.pageWrapper}>


            <section className={styles.hero}>
                <img src={bgOval} className={styles.heroOval} alt="" />
                <div className={styles.heroSemicircle} />

                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>{product.name}</h1>
                        <p className={styles.heroDesc}>{product.description}</p>
                    </div>
                    <div className={styles.heroDroneWrap}>
                        <img
                            src={productImg}
                            alt={product.name}
                            className={styles.heroDroneImg}
                            onError={(e) => { (e.target as HTMLImageElement).src = dronImg; }}
                        />
                    </div>
                </div>

                <div className={styles.floatingCard}>
                    <div className={styles.floatingCardTop}>
                        <img
                            src={productImg}
                            alt={product.name}
                            className={styles.floatingThumb}
                            onError={(e) => { (e.target as HTMLImageElement).src = dronImg; }}
                        />
                        <div>
                            <div className={styles.floatingName}>{product.name}</div>
                            <div className={styles.floatingPrices}>
                                {product.oldPrice && (
                                    <span className={styles.floatingOldPrice}>
                                        {product.oldPrice.toLocaleString()} ₴
                                    </span>
                                )}
                                <span className={styles.floatingPrice}>
                                    {product.price.toLocaleString()} ₴
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.floatingActions}>
                        <button className={styles.cartIconBtn} aria-label="Кошик">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                        </button>
                        <button className={styles.orderBtn} onClick={handleBuy}>
                            {cartAdded ? 'ДОДАНО ✓' : 'ЗАМОВИТИ →'}
                        </button>
                    </div>
                </div>
            </section>


            <section className={styles.featureSection}>
                <div className={styles.featureCenter}>
                    <h2 className={styles.featureTitle}>ВОЛОДІЙТЕ КОЖНИМ КУТОМ</h2>
                    <div className={styles.featureTextCols}>
                        <p>
                            Представляємо вдосконалену систему з трьома камерами, де кожен об'єктив має свої переваги, створюючи унікальні зображення — від широких ширококутних пейзажів до детальних телефото-знімків крупним планом. Усі три камери оснащені функцією Dual Native ISO Fusion.
                        </p>
                        <p>
                            Крім того, ви можете розкрити свій творчий потенціал завдяки можливості створення знімків у форматі RAW з високою роздільною здатністю (до 5 кадрів), а також таким функціям, як «Вільні панорами» та «Фокусування на об'єкті».
                        </p>
                    </div>
                </div>
            </section>


            <section className={styles.videoSection}>
                <div className={styles.videoWrap}>
                    <img src={forVideoImg} alt="Відео прев'ю" className={styles.videoBg} />
                    <div className={styles.videoOverlay}>
                        <button className={styles.playBtn} aria-label="Відео">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>


            <section className={styles.splitSection}>
                <div className={styles.splitText}>
                    <h2 className={styles.splitTitle}>ОСНОВНА КАМЕРА 4/3 CMOS<br />HASSELBLAD</h2>
                    <p className={styles.splitDesc}>
                        У ретельно розробленій 4/3 CMOS-камері Hasselblad використовується абсолютно новий 100-мегапіксельний сенсор і відома технологія Hasselblad Natural Color Solution (HNCS).
                    </p>
                    <p className={styles.splitDesc}>
                        Вона створює захоплюючі 100-мегапіксельні зображення з високою деталізацією та чіткістю, пропонуючи безпрецедентну гнучкість у пост-обробці.
                    </p>
                </div>
                <div className={styles.splitImage}>
                    <img src={cameraImg} alt="Камера Hasselblad" className={styles.splitImgDark} />
                </div>
            </section>

            <section className={styles.splitSectionReverse}>
                <div className={styles.splitImage}>
                    <img src={inAirImg} alt="Дрон у польоті" className={styles.splitImgFull} />
                </div>
                <div className={styles.splitText}>
                    <h2 className={styles.splitTitle}>51-ХВ ЧАС ПОЛЬОТУ</h2>
                    <p className={styles.splitDesc}>
                        Аеродинамічний дизайн Mavic 4 Pro, ефективна силова установка та акумуляторна батарея ємністю 95 Вт·год забезпечують тривалість польоту до 51 хвилини.
                    </p>
                    <p className={styles.splitDesc}>
                        Незалежно від того, чи ви розвідуєте місцевість або відпрацьовуєте маневри, достатня тривалість польоту дозволяє вам діяти легко і впевнено.
                    </p>
                </div>
            </section>

            <section className={styles.memorySection}>
                <div className={styles.memorySectionInner}>
                    <h2 className={styles.featureTitle}>ДО 512 ГБ ВБУДОВАНОЇ ПАМ'ЯТІ</h2>
                    <p className={styles.memoryDesc}>
                        Стандартна версія DJI Mavic 4 Pro поставляється з 64 ГБ вбудованої пам'яті, тому ви можете відразу ж почати зйомку без зовнішньої карти пам'яті.
                    </p>
                    <div className={styles.specStats}>
                        <div className={styles.specStat}>
                            <span className={styles.specStatValue}>ALL-I 4:2:2</span>
                            <span className={styles.specStatLabel}>Кодування</span>
                        </div>
                        <div className={styles.specStat}>
                            <span className={styles.specStatValue}>512 <sup>ГБ</sup></span>
                            <span className={styles.specStatLabel}>UFS Сховище</span>
                        </div>
                        <div className={styles.specStat}>
                            <span className={styles.specStatValue}>64 <sup>ГБ</sup></span>
                            <span className={styles.specStatLabel}>eMMC Storage</span>
                        </div>
                    </div>
                    <div className={styles.memoryImgWrap}>
                        <img src={storage512Img} alt="512GB Storage" className={styles.memoryImg} />
                    </div>
                </div>
            </section>

            <section className={styles.similarSection}>
                <h2 className={styles.similarTitle}>СХОЖІ ТОВАРИ</h2>
                <div className={styles.similarGrid}>
                    {similar.length > 0 ? similar.map(item => (
                        <div
                            key={item.id}
                            className={styles.similarCard}
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <div className={styles.similarImgWrap}>
                                <img
                                    src={item.media || item.imageUrl || dronImg}
                                    alt={item.name}
                                    className={styles.similarImg}
                                    onError={(e) => { (e.target as HTMLImageElement).src = dronImg; }}
                                />
                            </div>
                            <div className={styles.similarInfo}>
                                <p className={styles.similarName}>{item.name}</p>
                                <div className={styles.similarPrices}>
                                    {item.oldPrice && (
                                        <span className={styles.similarOldPrice}>
                                            {item.oldPrice.toLocaleString()} ₴
                                        </span>
                                    )}
                                    <span className={styles.similarPrice}>
                                        {item.price.toLocaleString()} ₴
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: '#a1a1aa', fontSize: 14 }}>Схожих товарів не знайдено</p>
                    )}
                </div>
                <div className={styles.similarBtnWrap}>
                    <button className={styles.viewAllBtn} onClick={() => navigate('/catalog')}>
                        ДИВИТИСЬ ВСІ →
                    </button>
                </div>
            </section>

        </div>
    );
};