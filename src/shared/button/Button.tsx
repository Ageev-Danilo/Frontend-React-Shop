import { ButtonProps } from "./button.types";
import styles from './button.module.css';


export function Button(props: ButtonProps) {
    const {type = "fill", className, ...restProps} = props

    return (
        <button 
            className={`${styles.button} ${styles[type]} ${className}`}
            {...restProps}
        >
        </button>
    )
}