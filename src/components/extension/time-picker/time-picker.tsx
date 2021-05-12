import { Box, RadioButtonGroup } from "grommet";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TimePickerProps, TimeValue } from "./types";
import { NumericUpDown } from "../numeric-updown";

const to12Hour = (date: Date) => {
  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  let seconds: number = date.getSeconds();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return [hours, minutes,seconds, ampm];
};

const to24Hour = (hours: number, minutes: number , second:number, ampm: "AM" | "PM") => {
  if (ampm == "PM" && hours < 12) hours = hours + 12;
  if (ampm == "AM" && hours == 12) hours = hours - 12;
  return [hours, minutes,second];
};

const TimePicker: React.FC<TimePickerProps> = (props) => {
  let [second, setSecond] = useState<number>(0);
  let [min, setMin] = useState<number>(0);
  let [hour, setHour] = useState<number>(0);
  let [AMPM, setAMPM] = useState<"AM" | "PM" | null>("AM");

  let [localValue, setLocalValue] = useState<Date | TimeValue | null>(null);
  let { value , onChange } = props;

  const updateValue = (hour: number, minute: number,second :number, ampm: "AM" | "PM") => {
    setLocalValue((lv) => {
      if (lv instanceof Date) {
        let [_hour, _min , _second] = to24Hour(hour, minute,second, ampm);
        lv.setHours(_hour,_min,_second);
      } else {
        lv!.seconds = second;
        lv!.hours = hour;
        lv!.minutes = min;
        lv!.XM = ampm;
      }

      return lv instanceof Date ? new Date(lv) : { ...lv! };
    });
    onChange && onChange(localValue as any);
  };

  useEffect(() => {
    if (!value) {
      value = new Date();
    }

    if (value instanceof Date) {
      let [_hours, _mins,_seconds, _ampm] = to12Hour(value);
      setSecond(_seconds as number);
      setMin(_mins as number);
      setHour(_hours as number);
      setAMPM(_ampm as any);
    } else {
      setSecond(value.seconds);
      setMin(value.minutes);
      setHour(value.hours);
      setAMPM(value.XM);
    }
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue) {
      updateValue(hour, min,second, AMPM!);
    }
  }, [min, hour,second, AMPM]);

  const handleHourChange = (h: number) => {
    setHour(h);
  };

  const handleMinChange = (m: number) => {
    setMin(m);
  };

  const handleSecondChange = (s: number) => {
    setSecond(s);
  };  

  return (
    <Box
      margin={{
        bottom: "0.5em",
      }}
      width="10em"
      align="center"
      border="all"
      pad="small"
      round="xsmall"
      background="light-1"
    >
      <Box
        direction="row"
        align="center"
        margin={{
          vertical: "1em",
        }}
      >
        <Box>
          <NumericUpDown
            value={hour}
            minValue={1}
            maxValue={23}
            changeTreshold={80}
            onChange={handleHourChange}
          />
        </Box>
        <Box
          margin={{
            horizontal: "xsmall",
          }}
        >
          <NumericUpDown
            value={min}
            onChange={handleMinChange}
            changeTreshold={80}
            minValue={1}
            maxValue={59}
          />
        </Box>
        <Box>
          <NumericUpDown
            value={second}
            minValue={1}
            maxValue={59}
            changeTreshold={80}
            onChange={handleSecondChange}
          />
        </Box>
      </Box>
      <Box>
        <Box>
          <RadioButtonGroup
            direction="row"
            name={"sdsd"}
            value={AMPM as string}
            options={["AM", "PM"]}
            onChange={(e : ChangeEvent<HTMLInputElement>) => setAMPM(e.target.value as any)}
          >
            {(option: string, { checked, hover }: any) => {
              let background;
              if (checked) background = "brand";
              else if (hover) background = "light-4";
              else background = "light-3";

              return (
                <Box background={background} pad="xsmall">
                  {option}
                </Box>
              );
            }}
          </RadioButtonGroup>
        </Box>
      </Box>
    </Box>
  );
};

export { TimePicker };
