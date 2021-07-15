import React, { useCallback } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { FormField } from "../../types";
import { DateInputProps } from "./types";
import { Box, Button, DateInput as DatePicker } from "grommet";
import { useSHFContext } from "../../../../context";
import { SubtractCircle } from "grommet-icons";

const DateInput: React.FC<FormField<DateInputProps>> = (props) => {
  let vrules = props.validationRules || {};
  let {
    name,
    label,
    defaultValue: initialValue,
    dateInputProps,
    minDate,
    maxDate,
    required,
    methods,
  } = props;

  const { translate: T } = useSHFContext();

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

  const resetValue = useCallback(
    (field: ControllerRenderProps<FieldValues>) => () => {
      field.onChange("");
    },
    []
  );
  const dateFormat = dateInputProps?.format || "yyyy/mm/dd";

  return (
    <Controller
      name={name}
      defaultValue={initialValue}
      rules={vrules as any}
      control={control}
      render={({ field }) => (
        <Box fill align="stretch" justify="stretch">
          <Box justify="stretch">
            <Box direction="row">
              <DatePicker
                {...dateInputProps}
                value={field.value}
                format={dateFormat}
                onChange={(e: any) => {
                  field.onChange(e.value);
                }}
              />
              {field.value && (
                <Button
                  icon={<SubtractCircle />}
                  focusIndicator={false}
                  onClick={resetValue(field)}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    ></Controller>
  );
};

export default DateInput;
