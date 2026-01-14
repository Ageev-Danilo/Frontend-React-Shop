import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { About, NotFound } from '../pages';

export function AppRoutes(){
    return (
        <BrowserRouter>
  
            <Routes>
                {/* Головна сторінка */}
                <Route path="/" element={<Layout />} />
                
                {/* Сторінка "About" */}
                <Route path="/about" element={<About />} />
                
                {/* Сторінка NotF 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>

     </BrowserRouter>
    );
};