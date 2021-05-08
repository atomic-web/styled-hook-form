import { FormEditorPropsBase } from "components/form-builder/types";
import React from "react";

export type CustomEditorProps = FormEditorPropsBase &{
     editorComponent : React.ReactElement
}