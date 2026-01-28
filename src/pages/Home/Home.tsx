import { Button } from '../../shared/button';

import mini from '../../assets/static/mini.png';
import minik from '../../assets/static/minik.png';
import flip from '../../assets/static/flip.png';
import dj from '../../assets/static/dj.png';

import styles from './Home.module.css';
import base from '../../shared/base/styles.module.css';
import '../../assets/fonts/font.css';


export function Home(){
    return (
        //artemiy
        <div className={styles.wrapper}>
            <div className={styles.about + ' ' + base.column}>
                <h2 className={base.title}>Про нас</h2>
                <p>
                    Ми — команда, що об'єднує технології та надійність. Пропонуємо дрони й тепловізори, перевірені у найскладніших умовах. Обираємо тільки те, чому довіряємо самі.
                </p>
                <Button className="view-btn" type='outline' 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#0C122A" style="fill:#0C122A;fill:color(display-p3 0.0471 0.0706 0.1647);fill-opacity:1;"/></svg>' 
                    pos='right'>
                        
                    Читати більше
                </Button>
            </div>
            <div>
                <h2 className={base.title}>Нове на сайті</h2>
                <div className={`${base.row} ${styles.new}`}>
                    <div className={styles.dronePrev + ' ' + styles.first + ' ' + base.column}>
                        <img src={minik} alt="" />
                        <div>
                            <h3>DJI Mini 4K</h3>
                            <p>Easy-To-Use Mini Camera Drone</p>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                    <div className={styles.dronePrev + ' ' + styles.second + ' ' + base.column}>
                        <img src={mini} alt="" />
                        <div>
                            <h3>DJI Mini 4K</h3>
                            <p>Easy-To-Use Mini Camera Drone</p>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                    <div className={styles.dronePrev + ' ' + styles.third + ' ' + base.column}>
                        <img src={minik} alt="" />
                        <div>
                            <h3>DJI Mini 4K</h3>
                            <p>Easy-To-Use Mini Camera Drone</p>
                            from to $299
                            <Button className="buy-btn" type='outline'>Купити</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.catalog + ' ' + base.column}>
                <h2 className={base.title}>Каталог</h2>
                <div className={base.row}>
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
                <Button className="view-more-btn" 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white" style="fill:white;fill-opacity:1;"/></svg>'
                    pos='right'>
                        
                    Дивитись всі
                </Button>
            </div>
        </div>
    );
};