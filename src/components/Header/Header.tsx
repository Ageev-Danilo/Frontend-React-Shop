import { Link } from "react-router-dom"
import styles from "./Header.module.css"
import { HeaderProps } from "./header.types";
import { useEffect, useState } from "react";
import { CartModal } from "../CartModal/CartModal";

export function Header (props: HeaderProps)  {
    const [ isScrolled, setScrolled ] = useState(false)
    const [ isCartOpen, setIsCartOpen ] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 70) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isScrolled) {
            e.preventDefault()

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsCartOpen(true)
    }

    const HeaderContent = (
        <div className={styles.header + (isScrolled ? ' ' + styles.scrolled : '')}>
            <div className={styles.gap}>
                <Link to={"catalog"}>Каталог</Link>
                <Link to={"about"}>Про нас</Link>
                <Link to={"contacts"}>Контакти</Link>
            </div>
            <Link to={"/"} className={styles.logo} onClick={handleLogoClick}></Link>
            <div className={styles.buttonsDiv}>
                <button 
                    className={styles.cartBtn}
                    onClick={handleCartClick}
                    aria-label="Кошик"
                ></button>
                <Link to = {"register"}><button className={styles.profileBtn }></button></Link>
            </div>
        </div>
    )
    
    return (
        <>
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
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
    )
};