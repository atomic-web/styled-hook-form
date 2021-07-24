import { FormFieldType } from "./types";
import { TextEditor } from "./editors/text-editor";
import { NumericEditor } from "./editors/numeric-editor";
import { DateEditor } from "./editors/date-editor";
import { BoolEditor } from "./editors/bool-editor";
import { DropDown } from "./editors/drop-down";
import { PasswordEditor } from "./editors/password-editor";
import { FileEditor } from "./editors/file-editor";
import { TimeEditor } from "./editors/time-editor";
import { CustomEditor } from "./editors/custom-editor";
import { SubFormEditor } from "./editors/subform-editor";

export const EditorMap: Partial<{ [K in keyof typeof FormFieldType]: any }> = {
  [FormFieldType.Text]: TextEditor,
  [FormFieldType.Number]: NumericEditor,
  [FormFieldType.Date]: DateEditor,
  [FormFieldType.Boolean]: BoolEditor,  
  [FormFieldType.DropDown]: DropDown,
  [FormFieldType.Password]: PasswordEditor,
  [FormFieldType.File]: FileEditor,
  [FormFieldType.Time]: TimeEditor,
  [FormFieldType.Custom]: CustomEditor,
  [FormFieldType.SubForm]: SubFormEditor,
};
