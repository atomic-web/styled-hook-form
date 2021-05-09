import { FormBuilderProps, FormEditorPropsBase } from "../../../form-builder/types";
import React from "react";

export type SubFormEditorProps = FormEditorPropsBase & {
    formProps : FormBuilderProps,
    content?: React.ReactNode,
    onSubmit? : (values: any)=>void
}