import React, { FormEvent, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import equals from "fast-deep-equal/es6";
import { FormMethodsRef, FormProps } from "./types";
import { isEmptyObject } from "../../components/utils/comp";
import { ChangeEventStore } from "./change-event-store";

const Form: React.FC<FormProps> = (props) => {
  
  const {
    methodsRef,
    onSubmit,
    children,
    changeHandlers,
    submitTreshould,
    autoSubmit,
    autoSubmitFields,
    options,
    ...rest
  } = props;

  const methods = useForm({
    mode: "onTouched",
    ...options,
  });  

  let refObj: FormMethodsRef = {
    methods,
    changeHandlers: new ChangeEventStore(),
  };

  if (methodsRef && methods) {
    if (typeof methodsRef === "function") {
      methodsRef(refObj);
    } else {
      methodsRef.current = refObj;
    }
  }

  const {
    handleSubmit,
    reset,
    control,
  } = methods;

  const valuesRef = useRef<any | null>(null);
  let defaultValues = props.options.defaultValues;

  useEffect(() => {

    if (
      !methods.formState.isDirty &&
      ((isEmptyObject(valuesRef.current) && ! isEmptyObject(defaultValues)) ||
        (Object.keys(valuesRef.current ?? {}).length ===
          Object.keys(defaultValues ?? {}).length &&
          !equals(valuesRef.current, defaultValues)))
    ) {
      reset(defaultValues);
      valuesRef.current = defaultValues;
    }
  }, [defaultValues]);

  const onFormSubmit = (values: any) => {
    onSubmit && onSubmit(values);
    return true;
  };

  const debuncedSubmit = useDebouncedCallback((values: any) => {
    onFormSubmit(values);
  }, submitTreshould);

  useEffect(() => {
    let watchSubscriptions = control._subjects.watch.subscribe({
      next: ({ name: changingName }: any) => {
        const getLiveValue = (name?: string | string[], defaultValues?: any) =>
          control._getWatch(name, defaultValues, false);
        if (changingName) {
          if (
            autoSubmit &&
            (!autoSubmitFields ||
              !autoSubmitFields?.length ||
              autoSubmitFields.some((f) => f.name === changingName))
          ) {
            debuncedSubmit(getLiveValue());
          }

          const _value = getLiveValue(
            changingName,
            props.options.defaultValues[changingName]
          );

          if (methodsRef) {
            refObj.changeHandlers?.emitChange(changingName, _value);
          }

          let listener =
            changeHandlers?.find((f) => f.name === changingName) ?? null;

          if (listener) {
            listener.handler(_value);
          }
        }
      },
    });

    return () => watchSubscriptions.unsubscribe();
  }, [props.options.defaultValues,changeHandlers]);
  
  const handleFormSubmit = (e: FormEvent) => {
    e.stopPropagation();
    handleSubmit(onFormSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} {...rest}>
      <FormProvider {...methods}>
        {children && children({ ...methods })}
      </FormProvider>
    </form>
  );
};

Form.defaultProps = {
  autoSubmit: false,
  autoSubmitFields: [],
  submitTreshould: 500,
};

export { Form as default };
