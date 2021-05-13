import { FormEditorPropsBase } from '../../types';

export type BoolInputProps = FormEditorPropsBase & {
    defaultValue? : boolean,
    controlType : "checkbox" | "switch"
}