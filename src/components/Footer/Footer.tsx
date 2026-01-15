import styles from './Footer.module.css';
import footerSvg from '../../assets/media/footer.svg';


export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.upper}>
                <div className="column">
                    <h2>1к+</h2>
                    <p>Успішних відправок</p>
                </div>
                <div className="column">
                    <h2>1.5к+</h2>
                    <p>Задоволених клієнтів</p>
                </div>
                <div className="column">
                    <h2>24/7</h2>
                    <p>Підтримка клієнтів</p>
                </div>
            </div>
            <div>
                <img src={footerSvg}/>
                <div className="row">
                    <a href="">Каталог</a>
                    <a href="">Про нас</a>
                    <a href="">Контакти</a>
                    <a href="">Кошик</a>
                    <a href="">Кабінет</a>
                </div>
                <hr />
                <p className="copyright">© 2025 Drones Всі права захищені.</p>
            </div>
        </footer>
    );
};