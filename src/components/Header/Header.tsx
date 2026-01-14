import styles from "./Header.module.css"

export function Header ()  {
    return (
        <header className={styles.header}>
            <a href="">Каталог</a>
            <a href="">Про нас</a>
            <a href="">Контакти</a>
            <div className="logo"></div>
            <button className="cart-btn"></button>
            <button className="profile-btn"></button>
        </header>
    );
};