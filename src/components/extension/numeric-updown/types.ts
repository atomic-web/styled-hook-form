export interface NumericUpDownProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  changeTreshold?: number;
}
