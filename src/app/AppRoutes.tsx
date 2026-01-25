import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { About, NotFound, Home } from '../pages';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}