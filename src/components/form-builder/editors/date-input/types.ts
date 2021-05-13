import { FormEditorPropsBase } from "../../types";

export type DateInputProps = FormEditorPropsBase & {
    minDate?: string,
    maxDate?: string,
    defaultValue: string | number
}