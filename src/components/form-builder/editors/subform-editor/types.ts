import {
  FormBuilderProps,
} from "../../../form-builder/types";
import React from "react";

export interface SubFormEditorProps {
  formProps: FormBuilderProps;
  content?: React.ReactNode;
  plain?: boolean;
}
