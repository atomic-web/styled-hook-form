import { FormEditorPropsBase } from "components/form-builder/types";

export type DateInputProps = FormEditorPropsBase & {
    minDate?: string,
    maxDate?: string,
    defaultValue: string | number
}