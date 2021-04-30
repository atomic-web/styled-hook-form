import { FormFieldOptions } from "../../../types";
import React from "react";
import { DeepMap, FieldError, FieldValues } from "react-hook-form";
import { PropType } from "types/utils";

export interface EditorWrapProps {
  children: React.ReactChild;
  errors?: DeepMap<FieldValues, FieldError>;
  name: string;
  label: string;
  renderLabel:boolean,
  editorType : PropType<FormFieldOptions,'type'>,
  tip?: React.ReactNode,
}
