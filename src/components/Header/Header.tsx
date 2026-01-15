import { Link } from "react-router-dom";
import styles from "./Header.module.css"

export const Header = () => {
    return (
        <header className={styles.header}>
            <Link to="/">КАТАЛОГ</Link>
            <Link to="/about">ПРО НАС</Link>
            <Link to="/contacts">КОНТАКТИ</Link> 
        </header>
    );
};