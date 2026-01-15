import { Header, Footer, Main } from '../../components';
import { Outlet } from 'react-router-dom';
import '../../assets/fonts/font.css';


export function Layout(){
    return (
        <div className="app-wrapper">
            <Header />
            <div style={{'height': '94px'}}/>
            <Main>
                <Outlet/>
            </Main>
            <Footer />
        </div>
    );
};