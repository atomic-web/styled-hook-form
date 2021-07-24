import { FormEditorPropsBase } from "../../types";
import {DateInputProps} from "grommet";

export type DateEditorProps = FormEditorPropsBase & {
    minDate?: string,
    maxDate?: string,
    dateInputProps?:DateInputProps
    defaultValue?: string | Date
}