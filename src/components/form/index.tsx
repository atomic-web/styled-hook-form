import React, { FormEvent, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import equals from "fast-deep-equal/es6";
import { FormProps } from "./types";
import { isEmptyObject } from "../../components/utils/comp";

const Form: React.FC<FormProps> = (props) => {
  const methods = useForm({
    mode: "onTouched",
    ...props.options,
  });

  const { methodsRef } = props;

  if (methodsRef && methods) {
    let refObj = {
      methods,
    };
    if (typeof methodsRef === "function") {
      methodsRef(refObj);
    } else {
      methodsRef.current = refObj;
    }
  }

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
  const valuesRef = useRef<any | null>(null);

  useEffect(() => {
    if (
      !methods.formState.isDirty &&
      (isEmptyObject(valuesRef.current) ||
        (
          Object.keys(valuesRef.current ?? {}).length ===
          Object.keys(props.options.defaultValues ?? {}).length &&
          !equals(valuesRef.current, props.options.defaultValues)))
    ) {
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
    <form onSubmit={handleFormSubmit}>
      <FormProvider {...methods}>
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
