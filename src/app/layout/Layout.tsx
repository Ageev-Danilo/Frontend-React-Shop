import { Header, Footer, Main } from '../../components';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './layout.module.css';


export function Layout(){
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className={styles.app}>
            <Header>
                {isHome && (
                    <div className={styles.column + ' ' + styles.title}>
                        <h1 className={styles.h1}>Технології</h1>
                        <h1 className={styles.h1}>Які змінюють реальність</h1>
                    </div>
                )}
            </Header>
            <div style={{'height': '94px'}}/>
            <Main>
                <Outlet/>
            </Main>
            <Footer />
        </div>
    );
};