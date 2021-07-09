import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { TextInputProps } from "./types";
import { TextInput as GrommetTextInput } from "grommet";
import { FormField } from "../../types";
import { useSHFContext } from "../../../../context";

const TextInput = forwardRef<HTMLInputElement, FormField<TextInputProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};

    const {translate : T } = useSHFContext();

    let {
      name,
      label,
      defaultValue: initialValue,
      minLength,
      maxLength,
      required,
      methods,
      inputProps
    } = props;

    let control = methods?.control;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label }),
      };
    }

    if (minLength) {
      vrules.minLength = {
        value: minLength,
        message: T("text-input-min-length-msg", {
          name: label,
          value: minLength,
        }),
      };
    }

    if (maxLength) {
      vrules.maxLength = {
        value: maxLength,
        message: T("text-input-max-length-msg", { name: label,value: maxLength }),
      };
    }

    return (
      <Controller        
        name={name}
        defaultValue={initialValue}
        rules={vrules as any}
        control={control}
        render={({ field }) => (
          <GrommetTextInput
            {...inputProps}
            ref={ref}            
            onChange={(e) => field.onChange(e)}
            value={field.value}
          />
        )}
      />
    );
  }
);

export default TextInput;
