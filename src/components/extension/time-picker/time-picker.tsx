import { Box, Drop, RadioButtonGroup, Text } from "grommet";
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TimePickerProps, TimeValue } from "./types";
import { NumericUpDown } from "../numeric-updown";
// @ts-ignore
import { inputStyle } from "grommet/utils/styles";
import styled, { ThemeContext } from "styled-components";

const InputBox = styled(Box)`
  ${inputStyle}
`;

const to12Hour = (date: Date) => {
  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  let seconds: number = date.getSeconds();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return [hours, minutes, seconds, ampm];
};

const to24Hour = (
  hours: number,
  minutes: number,
  second: number,
  ampm: "AM" | "PM"
) => {
  if (ampm == "PM" && hours < 12) hours = hours + 12;
  if (ampm == "AM" && hours == 12) hours = hours - 12;
  return [hours, minutes, second];
};

const pad2 = (num: number) => num.toString().padStart(2, "0");

const TimePicker: React.FC<TimePickerProps> = (props) => {
  const [second, setSecond] = useState<number>(0);
  const [min, setMin] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [AMPM, setAMPM] = useState<"AM" | "PM" | null>("AM");
  const [hasFocus, setHasFocus] = useState(false);

  const [localValue, setLocalValue] = useState<Date | TimeValue | null>(null);
  const { value: valueProp, onChange } = props;
  const inputRef = useRef(null);

  const updateValue = (
    hour: number,
    minute: number,
    second: number,
    ampm: "AM" | "PM"
  ) => {
    setLocalValue((lv) => {
      if (lv instanceof Date) {
        let [_hour, _min, _second] = to24Hour(hour, minute, second, ampm);
        lv.setHours(_hour, _min, _second);
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
    let value = valueProp ?? new Date();

    if (value instanceof Date) {
      let [_hours, _mins, _seconds, _ampm] = to12Hour(value);
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
  }, [valueProp]);

  useEffect(() => {
    if (localValue) {
      updateValue(hour, min, second, AMPM!);
    }
  }, [min, hour, second, AMPM]);

  const handleHourChange = (h: number) => {
    if (h > 0 && h < 12) {
      setHour(h);
    }
  };

  const handleMinChange = (m: number) => {
    if(m >=0 && m < 60){
      setMin(m);
    }
  };

  const handleSecondChange = (s: number) => {
    if(s >=0 && s < 60){
      setSecond(s);
    }
  };

  const handleFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  let themeContext = useContext(ThemeContext);

  return (
    <Box>
      <Box direction="row">
        <InputBox
          direction="row"
          justify="start"
          ref={inputRef}
          align="center"
          onClick={handleFocus}
        >
          <Box>
            <Text>{pad2(hour)}</Text>
          </Box>
          <span> : </span>
          <Box>
            <Text>{pad2(min)}</Text>
          </Box>
          <span> : </span>
          <Box>
            <Text>{pad2(second)}</Text>
          </Box>
          <Box margin={{ start: "0.5em" }}>
            <Text>{AMPM}</Text>
          </Box>
        </InputBox>
      </Box>
      {inputRef?.current && hasFocus && (
        <Drop
          target={inputRef.current!}
          onClickOutside={handleBlur}
          stretch={false}
          align={{
            top: "bottom",
            ...(themeContext.dir == "rtl"
              ? {
                  right: "right",
                }
              : {
                  left: "left",
                }),
          }}
          plain
        >
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
                  minValue={0}
                  maxValue={59}
                />
              </Box>
              <Box>
                <NumericUpDown
                  value={second}
                  minValue={0}
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
                  name={"ampm"}
                  value={AMPM as string}
                  options={["AM", "PM"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAMPM(e.target.value as any)
                  }
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
        </Drop>
      )}
    </Box>
  );
};

export { TimePicker };
