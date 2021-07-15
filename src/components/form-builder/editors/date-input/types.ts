import { FormEditorPropsBase } from "../../types";
import {DateInputProps as GrommetDateInputProps} from "grommet";

export type DateInputProps = FormEditorPropsBase & {
    minDate?: string,
    maxDate?: string,
    defaultValue?: string | number,
    dateInputProps?:GrommetDateInputProps
}