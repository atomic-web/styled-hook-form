import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TextInput } from "grommet";
import { NumericBoxProps } from "./types";
import { useFormBuilderContext } from "../../../context";
import { getLocaleFractionSeparator } from "../../utils/locale";

export function parseNumericValue(value: string, fractionSep: string): Number {
  return parseFloat(value.replace(fractionSep, "."));
}

export function formatNumbericValue(
  value: number | undefined,
  fractionSep: string
) {
  if (!value) {
    return "";
  }
  return value.toString().replace(".", fractionSep);
}

const NumericBox: React.FC<NumericBoxProps> = (props) => {
  const { onChange, value } = props;
  const ref = useRef<HTMLInputElement>(null);
  const [localValue, updateLocalValue] = useState(value);
  const { locale } = useFormBuilderContext();

  useEffect(() => {
    if (value !== null && value !== undefined) {
      updateLocalValue(value);
    }
  }, [value]);

  const fractionSep = getLocaleFractionSeparator(locale);
  const validValueRef = useRef("");

  const handleKeyup = useCallback(function (e: KeyboardEvent) {
    // eslint-disable-next-line no-eval
    const numericRegex = eval(`/^\\-?\\d*\\${fractionSep}?\\d*$/g`);
    const nextValue = e.target && (e.target as any).value;

    if (nextValue && nextValue !== "-" && !numericRegex.test(nextValue)) {
      const validValue = validValueRef.current;
      updateLocalValue(validValue);
      onChange && onChange(validValue);
    } else {
      validValueRef.current = nextValue;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[fractionSep]);

  const handleBlur = useCallback(() => {
    if (ref.current) {
      let value = ref.current.value;
      if (value.endsWith(fractionSep)) {
        onChange(value.slice(0, -1));
      }
    }
  }, [fractionSep, onChange]);

  useEffect(() => {
    const box = ref.current;
    if (box) {
      box.addEventListener("keyup", handleKeyup, false);
      box.addEventListener("blur", handleBlur, false);
    }
    return () => {
      if (box) {
        box.removeEventListener("keyup", handleKeyup, false);
        box.removeEventListener("blur", handleBlur, false);
      }
    };
  }, [handleBlur, handleKeyup, ref]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateLocalValue(value);
    onChange && onChange(value);
  };

  return (
    <TextInput
      {...(props as any)}
      onChange={handleChange}
      value={localValue}
      ref={ref}
    ></TextInput>
  );
};

export { NumericBox };
