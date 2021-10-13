import React, { FormEvent, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { FormMethodsRef, FormProps } from "./types";
import { ChangeEventStore } from "./change-event-store";
import { useInternalForm } from "./use-internal-form";

const Form: React.FC<FormProps> = (props) => {
  const {
    autoSubmitFields,
    submitTreshould,
    changeHandlers,
    methodsRef,
    autoSubmit,
    onSubmit,
    children,
    methods: methodsProp,
    options,
    ...rest
  } = props;
  debugger

  const methods = methodsProp ?? useInternalForm(options);

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

  const { handleSubmit, reset, control } = methods;



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
  }, []);

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
