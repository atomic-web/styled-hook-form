import { ChangeEvent, forwardRef } from "react";
import { Controller } from "react-hook-form";
import { NumericInputProps } from "./types";
import { FormField } from "components/form-builder/types";
import useTranslation from "next-translate/useTranslation";
import { NumericBox } from "components/extension/ui/numeric-box";

const NumericInput = forwardRef<HTMLInputElement, FormField<NumericInputProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const { t: T } = useTranslation("form");

    let {
      name,
      label,
      defaultValue: initialValue,
      min,
      max,
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

  

    return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules}
        control={control}
        render={({ field }) => (
          <NumericBox
            ref={ref}            
            onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.currentTarget.value)}
            defaultValue={field.value}
          />
        )}
      ></Controller>
    );
  }
);

export default NumericInput;
