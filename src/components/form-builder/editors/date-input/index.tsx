import React from 'react';
import { Controller } from "react-hook-form";
import { FormField } from "../../types";
import { DateInputProps } from "./types";
import { Box, DateInput as DatePicker } from "grommet";
import useTranslation from "next-translate/useTranslation";

const DateInput: React.FC<FormField<DateInputProps>> = (props) => {
  let vrules = props.validationRules || {};
  let {
    name,
    label,
    defaultValue: initialValue,
    minDate,
    maxDate,
    required,
    methods,
  } = props;

  const { t: T } = useTranslation("form");

  let control = methods?.control;

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label }),
    };
  }

  if (minDate) {
    vrules.min = {
      value: minDate,
      message: T("date-input-min-msg", { name: label, value: minDate }),
    };
  }

  if (maxDate) {
    vrules.max = {
      value: maxDate,
      message: T("date-input-max-msg", { name: label, value: maxDate }),
    };
  }

  return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules}
        control={control}
        render={({ field }) => (
          <Box fill align="stretch" justify="stretch">
            <Box justify="stretch">
              <DatePicker
                value={field.value}
                format="yyyy/mm/dd"
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            </Box>
          </Box>
        )}
      ></Controller>
  );
};

export default DateInput;
