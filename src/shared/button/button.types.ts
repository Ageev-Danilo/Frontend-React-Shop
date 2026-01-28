import { DetailedHTMLProps, HTMLAttributes } from "react";


export interface ButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    type?: 'fill' | 'outline',
    icon?: string
    icon?: string,
    pos?: 'left' | 'right'
}