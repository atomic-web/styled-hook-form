import React, { FormEvent, useEffect, useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

export type FormChildProps = UseFormReturn;

export type FieldWatcher{
  name : string ,
  handler : (value:any)=>void,
  defaultValue? : any
}

export interface AutoSubmitFormProps {
  changeHandlers?: FieldWatcher[];
  defaultValues: any;
  autoSubmit?: boolean;
  autoSubmitFields?: string[];
  submitTreshould?: number;
  onSubmit?: (state: any) => void;
  children?: (props: FormChildProps) => React.ReactNode;
}

const Form: React.FC<AutoSubmitFormProps> = (props) => {
  const methods = useForm({ defaultValues: props.defaultValues , mode:"onTouched" });
  const {
    handleSubmit,
    watch,
    formState: { isValid, errors },
    getValues,
    reset,
  } = methods;
  const { onSubmit, children, changeHandlers, submitTreshould, autoSubmit,autoSubmitFields } = props;
  const formRef = useRef<HTMLFormElement>(null);

  const onFormSubmit = () => {
    if (!isValid && errors.length) {
      return;
    }
    onSubmit && onSubmit(getValues());
    return true;
  };

  const debuncedSubmit = useDebouncedCallback(() => {
    onFormSubmit();
  }, submitTreshould);



  let watchers = autoSubmit ? (autoSubmitFields?.length ? watch(autoSubmitFields) : watch()) : [];

  let lastSubmited: any = null;

  if (autoSubmit) {
    if (autoSubmitFields?.length) {
      useEffect(() => {
        debuncedSubmit();
      }, Object.values(watchers));
    } else {
      useEffect(() => {
        if (lastSubmited == null) {
          debuncedSubmit();
          lastSubmited = watchers;
        }
      }, [watchers]);
    }
  }

  useEffect(() => {
    if (props.defaultValues) {
      reset(props.defaultValues);
    }
  }, [props.defaultValues]);

  const handleFormSubmit = (e: FormEvent) => {
    e.stopPropagation();
    handleSubmit(onFormSubmit)(e);
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      <FormProvider {...methods}>
        {children && children({ ...methods })}
      </FormProvider>
    </form>
  );
};

Form.defaultProps = {
  autoSubmit: false,
  watchFor: [],
  submitTreshould: 1000,
};

export { Form as default };
