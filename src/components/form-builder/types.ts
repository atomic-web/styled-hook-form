import React from "react";
import { FileInputProps } from "./editors/file-input/types";
import { BoolInputProps } from "./editors/bool-input/types";
import {
  FieldPathValue,
  RegisterOptions,
  UseFormReturn,
  ValidateResult,
} from "react-hook-form";
import { DateInputProps } from "./editors/date-input/types";
import { NumericInputProps } from "./editors/numeric-input/types";
import { TextInputProps } from "./editors/text-input/types";
import { DropDownProps } from "./editors/drop-down/types";
import { PasswordInputProps } from "./editors/password-input/types";
import { TimeInputProps } from "./editors/time-input/types";
import { PropType } from "types/utils";
import { GridProps } from "grommet";
import { CustomEditorProps } from "./editors/custom-editor/types";
import { SubFormEditorProps } from "./editors/subform-editor";

export enum FormFieldType {
  Text = 1,
  Number = 2,
  Boolean = 3,
  Date = 4,
  DateRange = 5,
  DropDown = 6,
  List = 7,
  Password = 8,
  File = 9,
  Time = 10,
  Custom = 11,
  SubForm = 12,
}

export type FormFieldOptions =
  | ({
      type: FormFieldType.Text;
    } & TextInputProps)
  | ({
      type: FormFieldType.Number;
    } & NumericInputProps)
  | ({
      type: FormFieldType.Date;
    } & DateInputProps)
  | ({
      type: FormFieldType.Boolean;
    } & BoolInputProps)
  | ({
      type: FormFieldType.DropDown;
    } & DropDownProps)
  | ({
      type: FormFieldType.Password;
    } & PasswordInputProps)
  | ({
      type: FormFieldType.File;
    } & FileInputProps)
  | ({
      type: FormFieldType.Time;
    } & TimeInputProps)
  | ({
      type: FormFieldType.Custom;
    } & CustomEditorProps)
  | ({
      type: FormFieldType.SubForm;
    } & SubFormEditorProps);

export declare type ValidateWithMethods<TFieldValue> = (
  value: TFieldValue,
  methods: UseFormReturn
) => ValidateResult | Promise<ValidateResult>;

export interface FieldValidationRules
  extends Omit<
    RegisterOptions,
    "validate" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  > {
  validate?:
    | ValidateWithMethods<FieldPathValue<any, any>>
    | Record<string, ValidateWithMethods<FieldPathValue<any, any>>>;
}

export interface FormFieldBase {
  name: string;
  tip?: React.ReactNode;
  defaultValue?: any;
  label: string;
  labelPosition?: "top" | "side";
  renderLabel?: boolean;
  render?: (
    base:
       (() => React.ReactNode)
      | ((props?: any) => React.ReactNode)
      | ((children?: React.ReactNode, props?: any) => React.ReactNode),
    formMethods: UseFormReturn<any>
  ) => React.ReactNode;
  validationRules?: FieldValidationRules;
  required?: boolean;
  submitTrigger?: boolean;
  onChange?: (value: any) => void;
  gridArea?: string;
  order?: number;
}

export type FormField<TProps extends {} = {}> = FormFieldBase &
  FormFieldOptions &
  TProps & {
    methods?: UseFormReturn;
  };

export interface FormBuilderProps<TModel = any>
  extends Partial<Omit<HTMLDivElement, "children">> {
  fields: FormField[];
  children?: React.ReactNode | ((methods: UseFormReturn) => React.ReactNode);
  model?: TModel;
  onSubmit?: (values: any) => void;
  beforeSubmit?: (values: TModel) => boolean;
  rows?: PropType<GridProps, "rows">;
  columns?: PropType<GridProps, "columns">;
  areas?: PropType<GridProps, "areas">;
}

export type FormEditorPropsBase = Pick<FormFieldBase, "validationRules"> & {};

export interface FormBuilderRef{
   methods : UseFormReturn
}