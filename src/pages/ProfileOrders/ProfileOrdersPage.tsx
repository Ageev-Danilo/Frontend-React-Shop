import React from 'react';
import styles from './ProfileOrdersPage.module.css';

export const ProfileOrdersPage = () => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarMainTitle}>ОСОБИСТИЙ КАБІНЕТ</h2>
                    <nav className={styles.nav}>
                        <a href="/profile/contacts" className={styles.navLink}>КОНТАКТНІ ДАНІ</a>
                        <a href="/profile/address" className={styles.navLink}>АДРЕСА ДОСТАВКИ</a>
                        <a href="/profile/orders" className={styles.navLinkActive}>МОЇ ЗАМОВЛЕННЯ</a>
                        <div className={styles.divider}></div>
                        <button className={styles.exitBtn}>ВИЙТИ</button>
                    </nav>
                </aside>

                <main className={styles.content}>
                    <h1 className={styles.pageTitle}>МОЇ ЗАМОВЛЕННЯ</h1>
                    
                    <div className={styles.emptyState}>
                        <p>У вас ще немає замовлень</p>
                        <a href="/catalog" className={styles.catalogLink}>
                            ПЕРЕЙТИ ДО КАТАЛОГУ
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
};