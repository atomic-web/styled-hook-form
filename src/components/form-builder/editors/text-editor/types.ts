import { FormEditorPropsBase } from "../../types";
import {TextInputProps } from 'grommet';

export type TextEditorProps = FormEditorPropsBase & {
    minLength?: number,
    maxLength?: number,
    defaultValue? : string,
    inputProps? : Omit<TextInputProps,"ref"|"onChange"|"value">
}