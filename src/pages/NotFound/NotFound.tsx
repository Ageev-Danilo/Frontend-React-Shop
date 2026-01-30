import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export function NotFound() {
    return (
        <section className={styles.container}>
            <div className={styles.watermark}>404</div>

            <div className={styles.leftSide}>
                <h2>Упс! Сторінку втрачено</h2>
                <p className={styles.descriptionText}>
                    Здається, ви зайшли не туди. Ця сторінка більше не існує або була перенесена.
                </p>
            </div>

            <div className={styles.rightSide}>
                <p className={styles.message}>
                    Ми пропонуємо вам повернутися на головну сторінку, щоб продовжити перегляд нашого каталогу.
                </p>
                <Link to="/" className={styles.btn}>На головну</Link>
            </div>
        </section>
    );
}