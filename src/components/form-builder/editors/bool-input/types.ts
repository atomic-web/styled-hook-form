import { FormEditorPropsBase } from 'components/form-builder/types';

export type BoolInputProps = FormEditorPropsBase & {
    defaultValue? : boolean,
    controlType : "checkbox" | "switch"
}