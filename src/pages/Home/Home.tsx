import droneImg from '../../assets/img/drone.png';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/button';

import mini from '../../assets/static/mini.png';
import minik from '../../assets/static/minik.png';
import flip from '../../assets/static/flip.png';
import dj from '../../assets/static/dj.png';

import styles from './Home.module.css';
import '../../assets/fonts/font.css';


export function Home(){
    return (
        <div className={styles.wrapper}>
            <img src={droneImg} />
            <div className={styles.bottomHeader}>
                <div className={styles.description}>
                    <div className={styles.textsP}>
                        <p>Передові технології в одному місці.<br/>Обирай найкраще для найважливішого.</p>
                    </div>
                    <Button>До каталогу</Button>
                </div>
                <div className={styles.bottomBackground}></div>
            </div>
            <div className="about">
                <h2>Про нас</h2>
                <p>
                    Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                </p>
                <Button className="view-btn">Читати більше</Button>
            </div>
            <div className="new">
                <h2>Нове на сайті</h2>
                <div className={styles.row}>
                    <div className="drone">
                        <img src={minik} alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                    <div className="drone">
                        <img src={mini} alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                    <div className="drone">
                        <img src={minik} alt="" />
                        <h3>DJI Mini 4K</h3>
                        <p>Easy-To-Use Mini Camera Drone</p>
                        <div>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="catalog">
                <h2>Каталог</h2>
                <div className={styles.row}>
                    <div className="drone">
                        <img src={mini} alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src={mini} alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src={mini} alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                    <div className="drone">
                        <img src={flip} alt="" />
                        <p>DJI Mini 4K</p>
                        <s>29 900 ₴</s>
                        <p className="discount">29 900 ₴ </p>
                    </div>
                </div>
                <Button className="view-more-btn">Дивитись всі</Button>
            </div>Button
        </div>
    );
};