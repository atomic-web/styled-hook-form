import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { NumericEditorProps } from "./types";
import { FormField } from "../../types";
import { NumericBox } from "../../../../components/extension";
import { useSHFContext } from "../../../../context";
import { formatNumbericValue, parseNumericValue } from "../../../extension/numeric-box/numeric-box";
import { getLocaleFractionSeparator } from "../../../utils/locale";

const endsWithFractionZero = (rawValue: string, fractionSep: string) =>
  eval(`/.*${fractionSep}0+$/g`).test(rawValue);

const NumericEditor = forwardRef<
  HTMLInputElement,
  FormField<NumericEditorProps>
>((props, ref) => {
  let vrules = props.validationRules || {};
  const { translate: T , locale} = useSHFContext();

  let {
    name,
    label,
    defaultValue: initialValue,
    shouldUnregister,
    min,
    max,
    required,
    methods,
    inputProps,
  } = props;

  let control = methods?.control;

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label }),
    };
  }

  if (min) {
    vrules.min = {
      value: min,
      message: T("numeric-input-min-msg", { name: label, value: min }),
    };
  }

  if (max) {
    vrules.max = {
      value: max,
      message: T("numeric-input-max-msg", { name: label, value: max }),
    };
  }

  const fractionSep = getLocaleFractionSeparator(locale);

  return (
    <Controller
      name={name!}
      defaultValue={initialValue}
      shouldUnregister={shouldUnregister}
      rules={vrules as any}
      control={control}
      render={({ field }) => {
        debugger;
        return (
          <NumericBox
            {...inputProps}
            ref={ref}
            onChange={(rawValue: any) => {
              var transformedValue = rawValue
                ? rawValue.endsWith(fractionSep) ||
                  rawValue === "-" ||
                  endsWithFractionZero(rawValue, fractionSep)
                  ? rawValue
                  : parseNumericValue(rawValue, fractionSep)
                : "";
              field.onChange(
                transformedValue === NaN ? null : transformedValue
              );
            }}
            value={formatNumbericValue(field.value, fractionSep)}
          />
        );
      }}
    ></Controller>
  );
});

export { NumericEditor };
