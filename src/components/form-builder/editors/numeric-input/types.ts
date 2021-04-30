import { FormEditorPropsBase } from "components/form-builder/types";


export type NumericInputProps = FormEditorPropsBase & {
    min?: number,
    max?: number,    
    defaultValue : number
}

