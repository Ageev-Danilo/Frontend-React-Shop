import droneImg from '../../assets/media/drone.png';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';
import '../../assets/fonts/font.css';


export function Home(){
    return (
        <div className={styles.wrapper}>
            <div className={styles.column + styles.title}>
                <h1 className={styles.h1}>Технології</h1>
                <h1 className={styles.h1}>Які змінюють реальність</h1>
            </div>
            <img src={droneImg} />
            <div className="purchase">
                <p>
                    Передові технології в одному місці. 
                    Обирай найкраще для найважливішого.
                </p>
                <button className="add-btn">До каталогу</button>
            </div>
            <div className="about">
                <h2>Про нас</h2>
                <p>
                    Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                </p>
                <button className="view-btn">Читати більше</button>
            </div>
            <div className="new">
                <h2>Нове на сайті</h2>
                <div className={styles.row}>
                    <div className="drone">
                        <img src="" alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <button className="buy-btn">Купити</button>
                        </div>
                    </div>
                    <div className="drone">
                        <img src="" alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <button className="buy-btn">Купити</button>
                        </div>
                    </div>
                    <div className="drone">
                        <img src="" alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <button className="buy-btn">Купити</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="catalog">
                <h2>Каталог</h2>
                <div className={styles.row}>
                    <div className="drone">
                        <img src="" alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src="" alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src="" alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src="" alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                </div>
                <button className="view-more-btn">Дивитись всі</button>
            </div>
        </div>
    );
};