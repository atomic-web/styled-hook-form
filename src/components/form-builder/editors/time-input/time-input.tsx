import React from "react";
import { Controller } from "react-hook-form";
import { TimeInputProps } from "./types";
import { FormField } from "../../types";
import { TimePicker } from "../../../extension/time-picker";
import { useGHFContext } from "../../../../context";

const TimeInput: React.FC<FormField<TimeInputProps>> = (props) => {
  let vrules = props.validationRules || {};

  const { translate: T } = useGHFContext();

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
      name={name}
      defaultValue={initialValue}
      rules={vrules as any}
      control={control}
      render={({ field }) => (
        <TimePicker onChange={(e) => field.onChange(e)} value={field.value} />
      )}
    />
  );
};

export { TimeInput };
