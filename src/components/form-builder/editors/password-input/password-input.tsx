import { forwardRef, useState } from "react";
import { Controller } from "react-hook-form";
import { PasswordInputProps } from "./types";
import { TextInput as GrommetTextInput } from "grommet";
import { FormField } from "components/form-builder/types";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import PasswordStrength from "./password-strength";

const PasswordBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PasswordInput = forwardRef<
  HTMLInputElement,
  FormField<PasswordInputProps>
>((props, ref) => {
  let vrules = props.validationRules || {};
  const { t: T } = useTranslation("form");
  const [passStrength, setPassStrength] = useState<number>(0);

  let {
    name,
    label,
    defaultValue: initialValue,
    methods,
    required,
    showPasswordStrength,
    minPasswordStrength,
  } = props;

  let control = methods?.control;

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label }),
    };
  }

  if (minPasswordStrength) {
    vrules.validate = () => {
      return passStrength >= minPasswordStrength! ? true : T("password-input-weak-password");
    };
  }

  const handlePassStrengthChange = (strength: number) => {
    setPassStrength(strength);
  };

  return (
      <Controller
        name={name}
        defaultValue={initialValue}
        rules={vrules}
        control={control}
        render={({ field }) => (
          <PasswordBoxWrap>
            <GrommetTextInput
              ref={ref}
              type="password"
              onChange={(e) => field.onChange(e)}
              defaultValue={field.value}
            />
            {showPasswordStrength && (
              <PasswordStrength
                password={field.value}
                onChange={handlePassStrengthChange}
              />
            )}
          </PasswordBoxWrap>
        )}
      />
  );
});
