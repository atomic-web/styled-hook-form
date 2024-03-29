import { UseFormProps, UseFormReturn } from "react-hook-form";
import { ChangeEventStore } from "./change-event-store";
export type FormChildProps = UseFormReturn;

export interface FormMethodsRef {
  methods: UseFormReturn;
  changeHandlers: ChangeEventStore;
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
  onSubmit?: (state: any) => void;
  children?: (props: FormChildProps) => React.ReactNode;
  options: UseFormProps<any, any>;
  methodsRef?: React.ForwardedRef<FormMethodsRef|null>;
  formMethods?:UseFormReturn
}
