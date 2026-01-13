import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404</h1>
            <p>Сторінку не знайдено</p>
            <Link to="/">Повернутися на головну</Link>
        </div>
    );
};