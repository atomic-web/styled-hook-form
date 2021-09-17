import { TextInputProps } from "grommet";

export type NumericBoxProps = TextInputProps &
  Omit<
    JSX.IntrinsicElements["input"],
    "onSelect" | "size" | "placeholder" | "onChange"
  > & {
      onChange : (value:any)=>void
  };
