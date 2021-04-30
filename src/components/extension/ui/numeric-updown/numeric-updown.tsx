import React from 'react';
import { Box } from "grommet";
import { ChangeEvent, useEffect, useState } from "react";
import { NumericBox } from "../numeric-box";
import { NumericUpDownProps } from "./types";
import { FormUp, FormDown } from "grommet-icons";
import { LongPressButton } from "../long-press-button";

const UpDownButton = ({ icon, onClick, changeTreshold, ...rest }: any) => (
  <LongPressButton
    plain
    primary
    {...rest}
    whilePress={onClick}
    onClick={onClick}
    pressCallbackTreshold={changeTreshold}
  >
    <Box direction="row" justify="center" pad="xxsmall">
      {icon}
    </Box>
  </LongPressButton>
);

const NumericUpDown: React.FC<NumericUpDownProps> = (props) => {
  let {
    onChange,
    changeTreshold = 100,
    minValue,
    maxValue,
    value: initialValue,
  } = props;
  let [value, setValue] = useState(1);

  useEffect(() => {
    setValue(initialValue ?? 0);
  }, [initialValue]);

  const notifyValue = (val: number) => {
    onChange && onChange(val);
  };

  const handleUp = () => {
    setValue((v: number) => {
      if (maxValue !== undefined && v >= maxValue) {
        notifyValue(v);
        return v;
      }
      v++;
      notifyValue(v);
      v;
      return v;
    });
  };

  const handleDown = () => {
    setValue((v: number) => {
      if (minValue !== undefined && v <= minValue) {
        notifyValue(v);
        return v;
      }
      v--;
      notifyValue(v);
      return v;
    });
  };

  const handleInputChage = (e: ChangeEvent<HTMLInputElement>) => {
    let valStr = e.target.value;
    let val = 0;
    if (!valStr) {
      val = 0;
    } else {
      val = parseInt(valStr);
      if (
        (minValue !== undefined && val < minValue) ||
        (maxValue !== undefined && val > maxValue)
      ) {
        val =
          Math.abs(minValue! - val) < Math.abs(maxValue! - val)
            ? minValue!
            : maxValue!;
      }
    }
    setValue(val);
    notifyValue(val);
  };

  return (
    <Box align="center">
      <Box>
        <UpDownButton
          icon={<FormUp color="light-1" />}
          onClick={handleUp}
          changeTreshold={changeTreshold}
        />
      </Box>
      <NumericBox
        value={value}
        onChange={handleInputChage}
        textAlign="center"
      />
      <Box>
        <UpDownButton
          icon={<FormDown color="light-1" />}
          onClick={handleDown}
          changeTreshold={changeTreshold}
        />
      </Box>
    </Box>
  );
};

export { NumericUpDown };
