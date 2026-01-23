import { Header, Footer, Main } from '../../components';
import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';


// interface LayoutProps {
//     children: ReactNode;
// }
// { children }: LayoutProps

export function Layout() {
    return (
        <div className={styles.appWrapper}>
            <Header />
            <div className={styles.content}>
                <Main>
                    <Outlet />
                </Main>
            </div>
            <div className={styles.footerWrapper}>
                <Footer />
            </div>
        </div>
    );  
}