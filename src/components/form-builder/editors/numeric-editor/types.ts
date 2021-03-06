import { TextInputProps } from "grommet";
import { FormEditorPropsBase } from "../../types";

export type NumericEditorProps = FormEditorPropsBase & {
  min?: number;
  max?: number;
  defaultValue?: number;
  inputProps?: Omit<
    TextInputProps,
    "ref" | "type" | "onChange" | "defaultValue"
  >;
};
