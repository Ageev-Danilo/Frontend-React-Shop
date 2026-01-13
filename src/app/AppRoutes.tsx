import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { About, NotFound } from '../pages';

export const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                {/* Головна сторінка */}
                <Route path="/" element={<div><h1>Головна сторінка</h1></div>} />
                
                {/* Сторінка "About" */}
                <Route path="/about" element={<About />} />
                
                {/* Сторінка NotF 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
};