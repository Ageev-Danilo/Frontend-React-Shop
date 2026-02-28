import { Link } from 'react-router-dom';

import styles from './Footer.module.css';
import deco from '../../assets/img/deco.svg';
import base from '../../shared/base/styles.module.css';


export function Footer() {
    return (
        <footer className={`${styles.footer}`}>
            <div className={`${styles.upper} ${base.row}`}>
                <div className={styles.column}> 
                    <h2>1K+</h2>
                    <p>Успішних відправок</p>
                </div>
                <div className={styles.column}>
                    <h2>1.5K+</h2>
                    <p>Задоволених клієнтів</p>
                </div>
                <div className={styles.column}>
                    <h2>24/7</h2>
                    <p>Підтримка клієнтів</p>
                </div>
            </div>
            <div className={base.column + ' ' + styles.bottomFooter}>
                <img src={deco}/>
                <div className={base.row + ' ' + base.centr + ' ' + styles.footerLinks}>
                    <Link to="catalog">Каталог</Link>
                    <Link to="about">Про нас</Link>
                    <Link to="contacts">Контакти</Link>
                    <Link to="cart">Кошик</Link>
                    <Link to="cabinet">Кабінет</Link>
                </div>
                <div className={base.column + ' ' + styles.copyright}>
                    <hr />
                    <p>© 2025 Drones Всі права захищені.</p>
                </div>
            </div>
        </footer>
    );
};