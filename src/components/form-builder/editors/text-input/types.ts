import { FormEditorPropsBase } from "../../types";
import {TextInputProps as GrommetTextInputProps} from 'grommet';

export type TextInputProps = FormEditorPropsBase & {
    minLength?: number,
    maxLength?: number,
    name: string,
    defaultValue? : string,
    inputProps? : Omit<GrommetTextInputProps,"ref"|"onChange"|"value">
}