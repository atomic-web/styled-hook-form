import React from "react";
import { Controller } from "react-hook-form";
import { TimeEditorProps } from "./types";
import { FormField } from "../../types";
import { TimePicker } from "../../../extension/time-picker";
import { useSHFContext } from "../../../../context";

const TimeEditor: React.FC<FormField<TimeEditorProps>> = (props) => {
  let vrules = props.validationRules || {};

  const { translate: T } = useSHFContext();

  let {
    name,
    label,
    defaultValue: initialValue,
    required,
    methods,
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
      name={name!}
      defaultValue={initialValue}
      rules={vrules as any}
      control={control}
      render={({ field }) => (
        <TimePicker onChange={(e) => field.onChange(e)} value={field.value} />
      )}
    />
  );
};

export { TimeEditor };
