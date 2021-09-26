import { FormEditorPropsBase } from "../../../form-builder/types";
import React from "react";

export type CustomEditorProps = FormEditorPropsBase & {
  editorWrapComponent: React.ReactElement;
  props?:any
};
