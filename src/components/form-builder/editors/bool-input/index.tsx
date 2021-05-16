import React from "react";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { BoolInputProps } from "./types";
import { CheckBox } from "grommet";
import { FormField } from "../../types";

const BoolInput = forwardRef<HTMLInputElement, FormField<BoolInputProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};

    let {
      name,
      defaultValue: initialValue,
      controlType,
      methods,
      label,
    } = props;

    let control = methods?.control;

    return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules as any}
        control={control}
        render={({ field }) => (
          <CheckBox
            ref={ref}
            label={label}
            checked={field.value}
            onChange={(e) => field.onChange(e)}
            value={field.value}
            toggle={controlType == "switch"}
          />
        )}
      />
    );
  }
);

export default BoolInput;
