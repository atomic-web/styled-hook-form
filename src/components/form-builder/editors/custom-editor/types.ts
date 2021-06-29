import { FormEditorPropsBase, FormField } from "../../../form-builder/types";
import React from "react";

export type CustomEditorProps = FormEditorPropsBase &{
     editorComponent : React.ReactElement<FormField<any>>
}