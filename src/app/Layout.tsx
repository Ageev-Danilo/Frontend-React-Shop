import { ReactNode } from 'react';
import { Header, Footer, Main } from '../components';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="app-wrapper">
            <Header />
            <Main>
                {children}
            </Main>
            <Footer />
        </div>
    );
};