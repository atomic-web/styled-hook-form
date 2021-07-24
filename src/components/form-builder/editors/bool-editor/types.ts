import { FormEditorPropsBase } from '../../types';

export type BoolEditorProps = FormEditorPropsBase & {
    defaultValue? : boolean,
    controlType : "checkbox" | "switch"
}