import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { TextEditorProps } from "./types";
import { TextInput as GrommetTextInput } from "grommet";
import { FormField } from "../../types";
import { useSHFContext } from "../../../../context";

const TextEditor = forwardRef<HTMLInputElement, FormField<TextEditorProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};

    const {translate : T } = useSHFContext();

    let {
      name,
      label,
      defaultValue: initialValue,
      shouldUnregister,
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
        name={name!}
        defaultValue={initialValue}
        shouldUnregister={shouldUnregister}
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

export {TextEditor};
