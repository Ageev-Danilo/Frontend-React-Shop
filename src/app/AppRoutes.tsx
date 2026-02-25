import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { About, NotFound, Home, Catalog } from '../pages';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPassword/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPassword/ResetPasswordPage';
import { ProfileContactsPage } from '../pages/ProfileContacts/ProfileContactsPage';
import { ProfileAddressPage } from '../pages/ProfileAddress/ProfileAddressPage';
import { ProfileOrdersPage } from '../pages/ProfileOrders/ProfileOrdersPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage/ProductDetailsPage';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="catalog" element={<Catalog />} />
                    
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    
                    <Route path="profile/contacts" element={<ProfileContactsPage />} />
                    <Route path="profile/address" element={<ProfileAddressPage />} />
                    <Route path="profile/orders" element={<ProfileOrdersPage />} />

                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

