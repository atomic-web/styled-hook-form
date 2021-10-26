import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { BoolEditorProps } from "./types";
import { CheckBox } from "grommet";
import { FormField } from "../../types";
import { useSHFContext } from "../../../../context";

const BoolEditor = forwardRef<HTMLInputElement, FormField<BoolEditorProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const {translate : T } = useSHFContext();

    let {
      name,
      defaultValue: initialValue,
      shouldUnregister,
      controlType,
      required,
      methods,
      label,
    } = props;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label }),
      };
    }

    let control = methods?.control;

    return (
      <Controller
        name={name!}
        defaultValue={initialValue ?? false}
        rules={vrules as any}
        control={control}
        shouldUnregister={shouldUnregister}
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

export {BoolEditor};
