import React, { useEffect, useState } from "react";
import { FormField } from "../../../form-builder/types";
import { useFormBuilderContext } from "../../../../context";
import { Controller } from "react-hook-form";
import { CustomEditorProps } from "./types";

const CustomEditor: React.FC<FormField<CustomEditorProps>> = (props) => {
  let vrules = props.validationRules || {};
  const { translate: T } = useFormBuilderContext();

  let {
    name,
    defaultValue: initialValue,
    methods,
    required,
    editorComponent,
    label,
    props: componentProps,
    shouldUnregister,
  } = props;

  let control = methods?.control;

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label ?? name }),
    };
  }

  let [customProps, setCustomProps] = useState({});

  useEffect(() => {
    if (componentProps) {
      setCustomProps(componentProps);
    }
  }, [componentProps]);

  return (
    <>
      {!name &&
        React.cloneElement(editorComponent, {
          ...customProps,
          methods,
        })}
      {name && (
        <Controller
          name={name}
          shouldUnregister={shouldUnregister}
          defaultValue={initialValue}
          rules={vrules as any}
          control={control}
          render={({ field }) => {
            let editorElement = React.cloneElement(editorComponent, {
              ...customProps,
              value: field.value,
              onChange: (e: any) =>
                Boolean(e) &&
                (!e.target || e.target === e.currentTarget) &&
                field.onChange(e),
              methods,
            });
            return editorElement;
          }}
        />
      )}
    </>
  );
};

export { CustomEditor };
