import { Link } from "react-router-dom"
import styles from "./Header.module.css"
import { HeaderProps } from "./header.types";
import { useEffect, useRef, useState } from "react";
import { CartModal } from "../CartModal/CartModal";

export function Header(props: HeaderProps) {
    const [isScrolled, setScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 70);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isScrolled) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCartOpen(prev => !prev);
    };

    const HeaderContent = (
        <div className={styles.header + (isScrolled ? ' ' + styles.scrolled : '')}>
            <div className={styles.gap}>
                <Link to={"catalog"}>Каталог</Link>
                <Link to={"about"}>Про нас</Link>
                <Link to={"contacts"}>Контакти</Link>
            </div>
            <Link to={"/"} className={styles.logo} onClick={handleLogoClick} />
            <div className={styles.buttonsDiv}>
                <button
                    ref={cartBtnRef}
                    className={styles.cartBtn}
                    onClick={handleCartClick}
                    aria-label="Кошик"
                />
                <Link to={"register"}>
                    <button className={styles.profileBtn} />
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                anchorRef={cartBtnRef}
            />

            {!isScrolled && (
                <header>
                    <div className="bottom">
                        {HeaderContent}
                        {props.children}
                    </div>
                </header>
            )}

            {isScrolled && (
                <>
                    {HeaderContent}
                    <header>
                        <div className="bottom">{props.children}</div>
                    </header>
                </>
            )}
        </>
    );
}