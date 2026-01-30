import { Header, Footer, Main } from '../../components';
import { Outlet, useLocation } from 'react-router-dom';

import droneImg from '../../assets/img/drone.png';
import deco from '../../assets/img/bg.svg';
import { Button } from '../../shared/button';
import styles from './layout.module.css';


export function Layout(){
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className={styles.app}>
            <Header>
                {isHome && (
                    <div className={styles.column + ' ' + styles.title}>
                        <h1 className={styles.h1}>Технології<br/>Які змінюють реальність</h1>
                        <img src={droneImg} className={styles.drone}/>
                        <div className={styles.bottomHeader}>
                            <div className={styles.description}>
                                <div className={styles.texts}>
                                    <div className={styles.textsP}>
                                        <p>Передові технології в одному місці.<br/>Обирай найкраще для найважливішого.</p>
                                    </div>
                                    <Button>До каталогу</Button>
                                </div>
                            </div>
                            <div className={styles.bottomBackground}></div>
                        </div>
                        <img src={deco} className={styles.deco} />
                    </div>
                )}
            </Header>
            <Main>
                <Outlet/>
            </Main>
            <Footer />
        </div>
    );
};