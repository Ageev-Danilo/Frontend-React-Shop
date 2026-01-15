import styles from "./Header.module.css"

export function Header ()  {
    return (
        <header className={styles.header}>
            <div className={styles.gap}>
                <a href="">Каталог</a>
                <a href="">Про нас</a>
                <a href="">Контакти</a>
            </div>
            <div className={styles.logo}></div>
            <div className={styles.gap}>
                <button className={styles.cartBtn}></button>
                <button className={styles.profileBtn}></button>
            </div>
        </header>
    );
};