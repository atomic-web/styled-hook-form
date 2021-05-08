import { FormFieldType } from './types';
import TextInput from './editors/text-input';
import NumericInput from './editors/numeric-input';
import DateInput from './editors/date-input';
import BoolInput from './editors/bool-input';
import DropDown from './editors/drop-down';
import { PasswordInput } from './editors/password-input';
import FileInput from './editors/file-input';
import { TimeInput } from './editors/time-input';
import { CustomEditor } from './editors/custom-editor';


export const EditorMap : Partial<{[K in keyof typeof FormFieldType] : any}> = {
    [FormFieldType.Text] : TextInput,
    [FormFieldType.Number] : NumericInput,
    [FormFieldType.Date] : DateInput,
    [FormFieldType.DateRange] : NumericInput,
    [FormFieldType.Boolean] : BoolInput,
    [FormFieldType.List] : NumericInput,
    [FormFieldType.DropDown] : DropDown,
    [FormFieldType.Password] : PasswordInput,
    [FormFieldType.File] : FileInput,
    [FormFieldType.Time] : TimeInput,
    [FormFieldType.Custom] : CustomEditor
}