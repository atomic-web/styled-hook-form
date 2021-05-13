import React from 'react';
import { TextInput } from "grommet";
import { NumericBoxProps } from "./types";
import { KeyboardEvent } from "react";

const NumericBox: React.FC<NumericBoxProps> = (props) => {
  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    const numericRegex = /^[0-9.\/]*$/;
    if (
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey &&
      e.key.length === 1 &&
      !numericRegex.test(e.key)
    ) {
      return e.preventDefault();
    }
  };

  return <TextInput {...props as any} onKeyDown={handleKeydown}></TextInput>;
};

export { NumericBox };
