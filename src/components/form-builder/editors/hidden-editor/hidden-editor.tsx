import { ChangeEvent, forwardRef, useCallback } from "react";
import { Controller } from "react-hook-form";
import { HiddenEditorProps } from "./types";
import { FormField } from "../../types";
import { useFormBuilderContext } from "../../../../context";

const HiddenEditor = forwardRef<HTMLInputElement, FormField<HiddenEditorProps>>(
  (props, ref) => {
    let vrules = props.validationRules || {};
    const { translate: T } = useFormBuilderContext();

    let {
      name,
      defaultValue: initialValue,
      shouldUnregister,
      methods,
      required,
      label
    } = props;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label ?? name }),
      };
    }

    let control = methods?.control;

    return (
      <Controller
        name={name!}
        defaultValue={initialValue}
        rules={vrules as any}
        control={control}
        shouldUnregister={shouldUnregister}
        render={({ field }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
              field.onChange(e.target.value);
            },
            [field]
          );

          return (
            <input
              ref={ref}
              type="hidden"
              onChange={handleChange}
              value={field.value}
            />
          );
        }}
      />
    );
  }
);

export { HiddenEditor };
