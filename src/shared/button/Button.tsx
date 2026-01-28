import { ButtonProps } from "./button.types";
import styles from './button.module.css';


export function Button(props: ButtonProps) {
    const {type = "fill", className, children, icon, pos, ...restProps} = props

    return (
        <button 
            className={`${styles.button} ${styles[type]} ${className ?? ''}`}
            {...restProps}
        >
        {icon && pos === 'left' && (
            <span dangerouslySetInnerHTML={{ __html: icon }}></span>
        )}
        {children}
        {icon && pos === 'right' && (
            <span dangerouslySetInnerHTML={{ __html: icon }}></span>
        )}
        </button>
    )
}