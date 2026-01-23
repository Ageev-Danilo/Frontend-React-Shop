import styles from "./Header.module.css"
import { Link } from 'react-router-dom'


export function Header ()  {
    return (
        <header className={styles.header}>
            <div className={styles.gap}>
                <Link to={"catalog"}>Каталог</Link>
                <Link to={"about"}>Про нас</Link>
                <Link to={"contacts"}>Контакти</Link>
            </div>
            <Link to={"/"} className={styles.logo}></Link>
            <div className={styles.gap}>
                <button className={styles.cartBtn}></button>
                <button className={styles.profileBtn}></button>
            </div>
        </header>
    );
};