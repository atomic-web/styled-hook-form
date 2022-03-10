import { CheckBoxProps } from 'grommet';
import { FormEditorPropsBase } from '../../types';

export type BoolEditorProps = FormEditorPropsBase & {
    defaultValue? : boolean,
    controlType : "checkbox" | "switch",
    checkBoxProps?:CheckBoxProps
}