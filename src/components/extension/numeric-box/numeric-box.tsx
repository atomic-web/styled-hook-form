import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { TextInput } from "grommet";
import { NumericBoxProps } from "./types";
import { useSHFContext } from "context";
import { getLocaleFractionSeparator } from "../../utils/locale";

export function parseNumericValue(value: string, fractionSep: string): Number {
  return parseFloat(value.replace(fractionSep, "."));
}

export function formatNumbericValue(value: number | undefined, fractionSep: string) {
  if (!value) {
    return "";
  }
  return value.toString().replace(".", fractionSep);
}

const NumericBox: React.FC<NumericBoxProps> = (props) => {
  const { onChange, value } = props;
  const ref = useRef<HTMLInputElement>(null);
  const [localValue, updateLocalValue] = useState(value);
  const { locale } = useSHFContext();

  useEffect(() => {
    if (value !== null && value !== undefined) {
      updateLocalValue(value);
    }
  }, [value]);

  const fractionSep = getLocaleFractionSeparator(locale);
  const validValueRef = useRef("");

  const handleKeyup = function (e: KeyboardEvent) {
    const numericRegex = eval(`/^\\-?\\d*\\${fractionSep}?\\d*$/g`);
    debugger;
    const nextValue = e.target && (e.target as any).value;

    if (nextValue && nextValue !== "-" && !numericRegex.test(nextValue)) {
      const validValue = validValueRef.current;
      updateLocalValue(validValue);
      onChange && onChange(validValue);
    } else {
      validValueRef.current = nextValue;
    }
  };

  const handleBlur = () => {
    if (ref.current) {
      let value = ref.current.value;
      if (value.endsWith(fractionSep)) {
        onChange(value.slice(0, -1));
      }
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("keyup", handleKeyup, false);
      ref.current.addEventListener("blur", handleBlur, false);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("keyup", handleKeyup, false);
        ref.current.removeEventListener("blur", handleBlur, false);
      }
    };
  }, []);

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
