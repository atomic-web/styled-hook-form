import { FormEditorPropsBase } from "../../types";
import {TextInputProps } from 'grommet';

export type TextEditorProps = FormEditorPropsBase & {
    minLength?: number,
    maxLength?: number,
    name: string,
    defaultValue? : string,
    inputProps? : Omit<TextInputProps,"ref"|"onChange"|"value">
}