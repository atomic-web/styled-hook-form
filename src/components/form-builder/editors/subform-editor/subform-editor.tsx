import React from "react";
import { FormField } from "../../../form-builder/types";
import { useGHFContext } from "../../../../context";
import { Controller } from "react-hook-form";
import { SubFormEditorProps } from "./types";
import { FormBuilder } from "../../../form-builder/form-builder";
import { Box } from "grommet";

const SubFormEditor: React.FC<FormField<SubFormEditorProps>> = (props) => {
  let vrules = props.validationRules || {};
  const { translate: T } = useGHFContext();

  let {
    name,
    defaultValue: initialValue,
    methods,
    required,
    formProps,
    content,
    children,
    onSubmit,
    label,
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
      rules={vrules as any}
      control={control}
      render={({ field }) => (
        <Box border pad="small">
          <FormBuilder
            {...formProps}
            model={field.value}
            children={children ?? content}
            onSubmit={(values) => {
              field.onChange(values);
              onSubmit && onSubmit(values)
            }}
          />
        </Box>
      )}
    />
  );
};

export { SubFormEditor };
