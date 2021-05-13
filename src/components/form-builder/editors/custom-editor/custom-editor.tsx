import React from 'react';
import { FormField } from "../../../form-builder/types";
import { useGHFContext } from "../../../../context";
import { Controller } from "react-hook-form";
import { CustomEditorProps } from "./types";

const CustomEditor: React.FC<FormField<CustomEditorProps>> = (props) => {
  
    let vrules = props.validationRules || {};
    const {translate : T } = useGHFContext();

    let {
      name,
      defaultValue: initialValue,
      methods,
      required,
      editorComponent,
      label
    } = props;

    let control = methods?.control;

    if (required) {
        vrules.required = {
          value: required,
          message: T("required-msg", { name: label }),
        };
    }

    return (
        <Controller
          name={name}
          defaultValue={initialValue}
          rules={vrules}
          control={control}
          render={({ field }) => {
            let editorElement = React.cloneElement(editorComponent,{
                value:field.value,
                onChange :(e :any)=> field.onChange(e)
            });
            return editorElement;
          }}
        />
    );
};

export {CustomEditor}
