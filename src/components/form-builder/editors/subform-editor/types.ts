import {
  FormBuilderProps, FormEditorPropsBase,
} from "../../../form-builder/types";
import React from "react";

export interface SubFormEditorProps extends FormEditorPropsBase {
  formProps?: FormBuilderProps;
  content?: React.ReactNode;
  plain?: boolean;
}
