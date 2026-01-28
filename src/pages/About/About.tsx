import styles from './About.module.css';
import base from '../../shared/base/styles.module.css';

import preview from '../../assets/static/abt/preview.png';
import preview2 from '../../assets/static/abt/preview2.png';
import preview3 from '../../assets/static/abt/preview3.png';


export function About(){
    return (
        // artemiy
        <div className={base.column + ' ' + styles.about}>
            <div className={base.column + ' ' + styles.top}>
                <div className={styles.description}>
                    <h1 className={base.title}>Про нас</h1>
                    <p>Ми — команда, яка об'єднана спільною метою: зробити передові технології доступними для кожного, хто потребує точності, безпеки та інновацій. З 2022 року ми спеціалізуємось на постачанні дронів і тепловізорів для професійного, цивільного та волонтерського використання.</p>
                </div>
                <img src={preview} />
            </div>
            <div className={base.row}>
                <div className={base.column + ' ' + styles.card}>
                    <h2>Наша місія</h2>
                    <p>Допомагати тим, хто стоїть на передовій — у прямому й переносному сенсі. Ми обираємо тільки надійну техніку, яку перевіряємо самі. Наша мета — якість, простота, і підтримка на кожному етапі: від покупки до використання.</p>
                </div>
                <img src={preview2} />
            </div>
            <div className={base.row + ' ' + styles.team + ' ' + styles.card}>
                <div className={base.column}>
                    <h2>Команда, якій можна довіряти</h2>
                    <p>Ми — не просто магазин. Ми — фахівці, які самі працюють із цією технікою й консультують з досвіду. Засновники проєкту — волонтери, військові та IT-спеціалісти, які об'єднали зусилля задля важливої справи.</p>
                </div>
                <img src={preview3} />
            </div>
        </div>
    );
};