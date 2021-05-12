import { TextInputProps } from "grommet";

export type NumericBoxProps = TextInputProps & Omit<JSX.IntrinsicElements['input'], 'onSelect' | 'size' | 'placeholder'> & {
    
}