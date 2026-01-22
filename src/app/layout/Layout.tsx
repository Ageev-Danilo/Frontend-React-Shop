import { Header, Footer, Main } from '../../components';
import { Outlet } from 'react-router-dom';
<<<<<<< HEAD
import '../../assets/fonts/font.css';


export function Layout(){
=======
import styles from './layout.module.css';


// interface LayoutProps {
//     children: ReactNode;
// }
// { children }: LayoutProps

export function Layout() {
>>>>>>> origin/Krivoruchko
    return (
        <div className={styles.appWrapper}>
            <Header />
<<<<<<< HEAD
            <div style={{'height': '94px'}}/>
            <Main>
                <Outlet/>
            </Main>
            <Footer />
=======
            <div className={styles.content}>
                <Main>
                    <Outlet />
                </Main>
            </div>
            <div className={styles.footerWrapper}>
                <Footer />
            </div>
>>>>>>> origin/Krivoruchko
        </div>
    );
}