import { TextInputProps } from 'grommet';
import { FormEditorPropsBase } from "../../types";


export type NumericInputProps = FormEditorPropsBase & {
    min?: number,
    max?: number,    
    defaultValue? : number,
    inputProps? : TextInputProps
}

