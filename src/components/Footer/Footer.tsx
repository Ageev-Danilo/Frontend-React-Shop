import styles from './Footer.module.css';
import deco from '../../assets/img/deco.svg';


export function Footer() {
    return (
        <footer className={`${styles.footer} center`}>
            <div className={`${styles.upper} row`}>
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
                <img src={deco}/>
                <div className="row centr">
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