import { forwardRef, useState } from "react";
import { Controller } from "react-hook-form";
import { PasswordEditorProps } from "./types";
import { Box, Button, TextInput as GrommetTextInput } from "grommet";
import { FormField } from "../../types";
import styled from "styled-components";
import PasswordStrength from "./password-strength";
import { useFormBuilderContext } from "../../../../context";
import { View, Hide } from "grommet-icons";
//@ts-ignore
import { inputStyle ,disabledStyle} from "grommet/utils/styles";

const PasswordBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const PasswordBox = styled<any>(Box)`
  ${inputStyle}
  ${(props) => props.theme.textInput && props.theme.textInput.extend};
  ${(props) =>
    props.disabled &&
    disabledStyle(
      props.theme.textInput.disabled && props.theme.textInput.disabled.opacity
    )}
  & input{
    border:none!important;
  }
`;

export const PasswordEditor = forwardRef<
  HTMLInputElement,
  FormField<PasswordEditorProps>
>((props, ref) => {
  let vrules = props.validationRules || {};
  const { translate: T } = useFormBuilderContext();

  const [passStrength, setPassStrength] = useState<number>(0);

  let {
    name,
    label,
    defaultValue: initialValue,
    methods,
    required,
    showPasswordStrength,
    minPasswordStrength,
    visibilityToggle = true,
    inputProps,
    shouldUnregister
  } = props;

  const [reveal, setReveal] = useState<boolean>(false);

  let control = methods?.control;

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label }),
    };
  }

  if (minPasswordStrength) {
    vrules.validate = () => {
      return passStrength >= minPasswordStrength!
        ? true
        : T("password-input-weak-password");
    };
  }

  const handlePassStrengthChange = (strength: number) => {
    setPassStrength(strength);
  };

  return (
    <Controller
      name={name!}
      defaultValue={initialValue}
      shouldUnregister={shouldUnregister}
      rules={vrules as any}
      control={control}
      render={({ field }) => (
        <PasswordBoxWrap>
          <PasswordBox
            direction="row"
            align="center"
            pad={{ horizontal: "small" }}
            {...inputProps as any}
          >
            <GrommetTextInput
              {...inputProps}
              ref={ref}
              type={reveal ? "text" : "password"}
              onChange={(e) => field.onChange(e)}
              defaultValue={field.value ?? ""}
              focusIndicator={false}
              plain="full"
            />
            {visibilityToggle && (
              <Button
                plain
                focusIndicator={false}
                icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
                onClick={() => setReveal(!reveal)}
              />
            )}
          </PasswordBox>
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
