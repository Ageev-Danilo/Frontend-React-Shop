import { ReactNode } from 'react';
import { Header, Footer, Main } from '../../components';
import { Outlet } from 'react-router-dom';


// interface LayoutProps {
//     children: ReactNode;
// }
// { children }: LayoutProps

export function Layout(){
    return (
        <div className="app-wrapper">
            <Header />
            <Main>
                <Outlet/>
            </Main>
            <Footer />
        </div>
    );
};