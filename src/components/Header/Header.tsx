import styles from './Header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <a href="">КАТАЛОГ</a>
            <a href="">ПРО НАС</a>
            <a href="">КОНТАКТИ</a>
        </header>
    );
};