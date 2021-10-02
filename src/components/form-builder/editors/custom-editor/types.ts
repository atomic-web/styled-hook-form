import { FormEditorPropsBase } from "../../../form-builder/types";
import React from "react";

export type CustomEditorProps = FormEditorPropsBase & {
  editorComponent: React.ReactElement;
  props?:any
};
