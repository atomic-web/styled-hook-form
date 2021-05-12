export interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
  XM: "AM" | "PM";
}

export interface TimePickerProps {
  value?: Date | TimeValue;
  onChange?: (value : Date | TimeValue)=>void 
}
