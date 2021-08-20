import { FormBuilderProps, FormEditorPropsBase } from "../../../form-builder/types";
import React from "react";
import { FieldPath, FieldValues } from "react-hook-form";

export type SubFormEditorProps = FormEditorPropsBase & {
    formProps : FormBuilderProps,
    content?: React.ReactNode,
    plain?:boolean,
    onSubmit? : (values: any)=>void,
    mergeToParent?: boolean;
    model?:any
} &(
 | {
    mergeToParent: true;
    name?:FieldPath<FieldValues>;
 }
 | {
    mergeToParent?: false;
    name:FieldPath<FieldValues>;
  }
)