import React from 'react';
import styles from './Catalog.module.css';

import mini from '../../assets/static/mini.png'; 
import minik from '../../assets/static/minik.png'; 
import dj from '../../assets/static/dj.png'; 
import flip from '../../assets/static/flip.png'; 
import thermal350pro from '../../assets/static/thermal/thermal350pro.png'; 
import thermal650d from '../../assets/static/thermal/thermal650d.png'; 
import thermalir510 from '../../assets/static/thermal/thermalir510.png'; 
import thermalpardleopard from '../../assets/static/thermal/thermalpardleopard.png'; 
import thermalq14 from '../../assets/static/thermal/thermalq14.png'; 
import thermalxlt160 from '../../assets/static/thermal/thermalxlt160.png'; 
import thermalxq35 from '../../assets/static/thermal/thermalxq35.png'; 
import thermalxq35pro from '../../assets/static/thermal/thermalxq35pro.png'; 


interface ICatalogProduct {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    img: string;
    isDiscount?: boolean;
}

const mockProducts: ICatalogProduct[] = [
    { 
        id: 1, 
        name: 'Тепловізор Pulsar Telos LRF XQ35', 
        price: 29900, 
        oldPrice: 34000, 
        isDiscount: true,
        img: thermalxq35 
    },
    { 
        id: 2, 
        name: 'DJI Mini 4K', 
        price: 29900, 
        img: minik 
    },
    { 
        id: 3, 
        name: 'DJI Mini 4 Pro', 
        price: 29900, 
        img: dj 
    },
    { 
        id: 4, 
        name: 'DJI Flip', 
        price: 29900, 
        img: flip 
    },
    { 
        id: 5, 
        name: 'DJI Mini 4K', 
        price: 29900, 
        img: minik 
    },
    { 
        id: 6, 
        name: 'Тепловізор Pulsar Axion 2 LRF XQ35 Pro', 
        price: 29900, 
        img: thermalxq35pro
    },
    { 
        id: 7, 
        name: 'DJI Mini 4 Pro', 
        price: 29900, 
        img: dj 
    },
    { 
        id: 8, 
        name: 'Тепловізор Guide IR510 Nano N2 WiFi', 
        price: 29900, 
        img: thermalir510
    },
    { 
        id: 9, 
        name: 'DJI Mini 4K', 
        price: 29900, 
        oldPrice: 35000, 
        isDiscount: true, 
        img: minik 
    },
    { 
        id: 10, 
        name: 'Тепловізор ARMASIGHT Q14', 
        price: 29900, 
        img: thermalq14
    },
    { 
        id: 11, 
        name: 'DJI Mini 4 Pro', 
        price: 29900, 
        img: dj 
    },
    { 
        id: 12, 
        name: 'Тепловізор ATN OTS-XLT 160 2.5-10X', 
        price: 29900, 
        img: thermalxlt160,
    },
];

export function Catalog() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Каталог</h1>

            <div className={styles.filters}>
                <button className={`${styles.filterBtn} ${styles.active}`}>Всі</button>
                
                <button className={styles.filterBtn}>
                    <img src={dj} alt="Дрони" className={styles.filterImg} />
                </button>
                
                <button className={styles.filterBtn}>
                    <img src={thermalxlt160} alt="Тепловізори" className={styles.filterImg} />
                </button>
            </div>

            <div className={styles.grid}>
                {mockProducts.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={product.img} alt={product.name} />
                        </div>
                        <h3 className={styles.cardTitle}>{product.name}</h3>
                        
                        <div className={styles.priceRow}>
                            {product.oldPrice && (
                                <span className={styles.oldPrice}>
                                    {product.oldPrice.toLocaleString()} ₴
                                </span>
                            )}
                            
                            <span className={`${styles.price} ${product.isDiscount ? styles.priceRed : ''}`}>
                                {product.price.toLocaleString()} ₴
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                 <button className={styles.pageBtn}>&lt;</button>
                 <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                 <button className={styles.pageBtn}>2</button>
                 <button className={styles.pageBtn}>3</button>
                 <button className={styles.pageBtn}>...</button>
                 <button className={styles.pageBtn}>&gt;</button>
            </div>
        </div>
    );
}