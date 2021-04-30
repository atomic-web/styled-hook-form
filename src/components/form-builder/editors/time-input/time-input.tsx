import React from 'react';
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { TimeInputProps } from "./types";
import { FormField } from "../../types";
import useTranslation from "next-translate/useTranslation";
import { TimePicker } from "../../../extension/ui/time-picker";

const TimeInput = forwardRef<HTMLInputElement, FormField<TimeInputProps>>(
  (props) => {
    let vrules = props.validationRules || {};

    const { t: T } = useTranslation("form");

    let {
      name,
      label,
      defaultValue: initialValue,
      // minLength,
      // maxLength,
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

    // if (minLength) {
    //   vrules.minLength = {
    //     value: minLength,
    //     message: T("text-input-min-length-msg", {
    //       name: label,
    //       value: minLength,
    //     }),
    //   };
    // }

    // if (maxLength) {
    //   vrules.maxLength = {
    //     value: maxLength,
    //     message: T("text-input-max-length-msg", { name: label,value: maxLength }),
    //   };
    // }

    return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules}
        control={control}
        render={({ field }) => (
          <TimePicker
            onChange={(e) => field.onChange(e)}
            value={field.value}
          />
        )}
      />
    );
  }
);

export {TimeInput};
