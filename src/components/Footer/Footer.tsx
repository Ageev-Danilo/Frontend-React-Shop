import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import deco from '../../assets/img/deco.svg';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.upper}>
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

            <div className={styles.bottomFooter}>
                <div className={styles.decoWrapper}>
                    <img src={deco} alt="DRONES" className={styles.decoImage} />
                </div>

                <div className={styles.footerLinks}>
                    <Link to="catalog">Каталог</Link>
                    <Link to="about">Про нас</Link>
                    <Link to="contacts">Контакти</Link>
                    <Link to="cart">Кошик</Link>
                    <Link to="profile/contacts">Кабінет</Link>
                </div>

                <div className={styles.copyright}>
                    <hr />
                    <p>© 2025 Drones Всі права захищені.</p>
                </div>
            </div>
        </footer>
    );
}