import { FormMethodsRef, FormOptions } from "./../form/types";
import { HiddenEditorProps } from "./editors/hidden-editor/types";
import React, {
  ForwardedRef,
} from "react";
import { FileEditorProps } from "./editors/file-editor/types";
import { BoolEditorProps } from "./editors/bool-editor/types";
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  UseFormReturn,
  ValidateResult,
} from "react-hook-form";
import { DateEditorProps } from "./editors/date-editor/types";
import { NumericEditorProps } from "./editors/numeric-editor/types";
import { TextEditorProps } from "./editors/text-editor/types";
import { DropDownProps } from "./editors/drop-down/types";
import { PasswordEditorProps } from "./editors/password-editor/types";
import { TimeEditorProps } from "./editors/time-editor/types";
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
  Hidden = 13,
}

export type FormFieldOptions =
  | ({
      type: FormFieldType.Text;
    } & TextEditorProps)
  | ({
      type: FormFieldType.Number;
    } & NumericEditorProps)
  | ({
      type: FormFieldType.Date;
    } & DateEditorProps)
  | ({
      type: FormFieldType.Boolean;
    } & BoolEditorProps)
  | ({
      type: FormFieldType.DropDown;
    } & DropDownProps)
  | ({
      type: FormFieldType.Password;
    } & PasswordEditorProps)
  | ({
      type: FormFieldType.File;
    } & FileEditorProps)
  | ({
      type: FormFieldType.Time;
    } & TimeEditorProps)
  | ({
      type: FormFieldType.Custom;
    } & CustomEditorProps)
  | ({
      type: FormFieldType.SubForm;
    } & SubFormEditorProps)
  | ({
      type: FormFieldType.Hidden;
    } & HiddenEditorProps);

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
  tip?: React.ReactNode;
  defaultValue?: any;
  label: string;
  labelPosition?: "top" | "side";
  renderLabel?: boolean;
  render?: (
    base:
      | (() => React.ReactNode)
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
  visible?: boolean;
  shouldUnregister?: boolean;
  wrapComponent?: React.ReactElement;
}

export type FormField = FormFieldBase &
  FormFieldOptions & {
    methods?: UseFormReturn;
  } & (
    | {
        name: FieldPath<FieldValues>;
      }
    | {
        type: FormFieldType.SubForm;
        name?: FieldPath<FieldValues>;
      }
    | {
        type: FormFieldType.Custom;
        name?: FieldPath<FieldValues>;
      }
  );

export type FormEditorPropsBase = Pick<FormFieldBase, "validationRules"> & {};

export type FormChildren<TModel extends FieldValues = FieldValues> =
  | React.ReactNode
  | ((methods: UseFormReturn<TModel>) => React.ReactNode);

export type FormBuilderOptions<TModel extends FieldValues = FieldValues> = {
  model?: TModel;
  onSubmit?: (values: any) => void;
  beforeSubmit?: (values: TModel) => boolean | Promise<boolean>;
  autoSubmitTreshould?: number;
  partialForm?: boolean;
  options?: FormOptions<TModel>;
  layout?: "GRID" | React.ReactElement | undefined;
  rows?: PropType<GridProps, "rows">;
  columns?: PropType<GridProps, "columns">;
  areas?: PropType<GridProps, "areas">;
  editorWrapComponent?: React.ReactElement;
  devMode?: boolean;
  ref?: ForwardedRef<FormMethodsRef<TModel>>;
};

export type FormFieldMap<
  TModel extends FieldValues = never
> = TModel extends never
  ? {
      [K in keyof TModel]: FormField;
    }
  : any;

export type FormFieldViews<TModel extends FieldValues = FieldValues> = {
  [K in keyof TModel]: React.ReactNode;
};

export type UseFormBuilderOptions<
  TModel extends FieldValues = FieldValues
> = FormBuilderOptions<TModel> & {
  fields: FormFieldMap<TModel> | FormField[];
  autoRender?: boolean;
};

export type UseFormBuilderInternalOptions<
  TModel extends FieldValues = FieldValues
> = FormBuilderOptions<TModel> & {
  autoRender: boolean;
  fields: FormField[];
  methods?: UseFormReturn<TModel>;
  defaultValues?: any;
};

export type FormBuilderProps<
  TModel extends FieldValues = FieldValues
> = Partial<Omit<HTMLFormElement, "children">> &
  FormBuilderOptions<TModel> & {
    children?: FormChildren;
    fields: FormField[];
  };

export type UseFormBuilderReturn<TModel> = {
  Form: React.ForwardRefExoticComponent<Partial<FormBuilderProps>>;
  fieldViews: FormFieldViews<TModel>;
};
