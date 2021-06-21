import React, { FormEvent, useEffect, useRef } from "react";
import {
  FormProvider,
  useForm,
  UseFormReturn,
  UseFormProps,
} from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import equals from "fast-deep-equal/es6";
import { DevTool } from "@hookform/devtools";

export type FormChildProps = UseFormReturn;

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
}

const Form: React.FC<FormProps> = (props) => {
  const methods = useForm({
    mode: "onTouched",
    ...props.options,
  });

  const { devMode } = props;

  const {
    handleSubmit,
    formState: { isValid, errors },
    reset,
    control,
  } = methods;
  const {
    onSubmit,
    children,
    changeHandlers,
    submitTreshould,
    autoSubmit,
    autoSubmitFields,
  } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const valuesRef = useRef<any | null>(null);

  useEffect(() => {
    if (!equals(valuesRef.current, props.options.defaultValues)) {
      reset(props.options.defaultValues);
      valuesRef.current = props.options.defaultValues;
    }
  }, [props.options.defaultValues]);

  const onFormSubmit = (values: any) => {
    if (!isValid && errors.length) {
      return;
    }
    onSubmit && onSubmit(values);
    return true;
  };

  const debuncedSubmit = useDebouncedCallback((values: any) => {
    onFormSubmit(values);
  }, submitTreshould);

  useEffect(() => {
    let watchSubscriptions = control.subjectsRef.current.watch.subscribe({
      next: ({ name: changingName }: any) => {
        const getLiveValue = (name?: string | string[], defaultValues?: any) =>
          control.watchInternal(name, defaultValues, false);
        if (changingName) {
          if (
            autoSubmit &&
            (!autoSubmitFields ||
              !autoSubmitFields?.length ||
              autoSubmitFields.some((f) => f.name === changingName))
          ) {
            debuncedSubmit(getLiveValue());
          }

          let listener =
            changeHandlers?.find((f) => f.name === changingName) ?? null;

          if (listener) {
            listener.handler(
              getLiveValue(
                changingName,
                props.options.defaultValues[changingName]
              )
            );
          }
        }
      },
    });

    return () => watchSubscriptions.unsubscribe();
  }, []);
  const handleFormSubmit = (e: FormEvent) => {
    e.stopPropagation();
    handleSubmit(onFormSubmit)(e);
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      <FormProvider {...methods}>
        {devMode && methods.control && <DevTool control={methods.control} />}
        {children && children({ ...methods })}
      </FormProvider>
    </form>
  );
};

Form.defaultProps = {
  autoSubmit: false,
  autoSubmitFields: [],
  submitTreshould: 1000,
};

export { Form as default };
