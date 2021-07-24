import { ChangeEvent, forwardRef } from "react";
import { Controller } from "react-hook-form";
import { NumericEditorProps } from "./types";
import { FormField } from "../../types";
import { NumericBox } from "../../../../components/extension";
import { useSHFContext } from "../../../../context";

const NumericEditor = forwardRef<HTMLInputElement, FormField<NumericEditorProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const { translate: T } = useSHFContext();

    let {
      name,
      label,
      defaultValue: initialValue,
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

    return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules as any}
        control={control}
        render={({ field }) => (
          <NumericBox
            {...inputProps}
            ref={ref}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              field.onChange(parseFloat(e.currentTarget.value || "0"))
            }
            value={field.value}
          />
        )}
      ></Controller>
    );
  }
);

export {NumericEditor};
