import { UseFormProps, UseFormReturn } from "react-hook-form";
export type FormChildProps = UseFormReturn;

export interface FormMethodsRef {
  methods: UseFormReturn;
}

export interface WatchField {
  name: string;
  handler: (value: any) => void;
  defaultValue?: any;
}

export interface FormProps {
  changeHandlers?: WatchField[];
  autoSubmit?: boolean;
  autoSubmitFields?: WatchField[];
  submitTreshould?: number;
  devMode?: boolean;
  onSubmit?: (state: any) => void;
  children?: (props: FormChildProps) => React.ReactNode;
  options: UseFormProps<any, any>;
  methodsRef?: React.ForwardedRef<FormMethodsRef|null>;
}
