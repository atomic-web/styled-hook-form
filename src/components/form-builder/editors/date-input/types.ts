import { FormEditorPropsBase } from "../../types";
import {DateInputProps as GrommetDateInputProps} from "grommet";

export type DateInputProps = FormEditorPropsBase & {
    minDate?: string,
    maxDate?: string,
    dateInputProps?:GrommetDateInputProps
    defaultValue?: string | Date
}