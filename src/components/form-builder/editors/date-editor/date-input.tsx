import React, { useCallback } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { Box, Button, DateInput as DatePicker, ThemeContext } from "grommet";
import { SubtractCircle } from "grommet-icons";
import { FormField } from "../../types";
import { DateEditorProps } from "./types";
import { useFormBuilderContext } from "../../../../context";
import { useContext } from "react";
import { ThemeType } from "../../../../themes/base-theme";

const DateEditor: React.FC<FormField<DateEditorProps>> = (props) => {
  let vrules = props.validationRules || {};
  let {
    name,
    label,
    defaultValue: initialValue,
    shouldUnregister,
    dateInputProps,
    minDate,
    maxDate,
    required,
    methods,
  } = props;

  const { translate: T, locale } = useFormBuilderContext();
  const theme = useContext(ThemeContext) as ThemeType;

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
  const dateFormat =
    theme.dateInput?.dateFormat || dateInputProps?.format || "yyyy/mm/dd";
  const normalValue = !initialValue
    ? initialValue
    : typeof initialValue === "string"
    ? initialValue
    : (initialValue as Date).toISOString();

  return (
    <Controller
      name={name!}
      defaultValue={normalValue}
      rules={vrules as any}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field }) => {
        console.log(field.value);
        return (
          <Box fill align="stretch" justify="stretch">
            <Box justify="stretch">
              <Box direction="row">
                <DatePicker
                  {...dateInputProps}
                  calendarProps={{
                    ...dateInputProps?.calendarProps,
                    locale,
                  }}
                  defaultValue={field.value}
                  value={field.value}
                  format={dateFormat}
                  onChange={(e: any) => {
                    field.onChange(e.value ? e.value : "");
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
        );
      }}
    ></Controller>
  );
};

export { DateEditor };
