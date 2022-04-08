import React, {
  useCallback,
  useState,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import equals from "fast-deep-equal/es6";
import { FormMethodsRef, FormProps, WatchField } from "./types";
import { isEmptyObject } from "../../components/utils/comp";
import { ChangeEventStore } from "./change-event-store";
import { InternalFormContextProvider } from "./internal-form-context";
import { makeArray } from "../../components/utils/types";

const Form: React.FC<FormProps> = (props) => {
  const {
    methodsRef,
    onSubmit,
    children,
    changeHandlers: changeHandlersProp,
    submitTreshould,
    autoSubmit: autoSubmitProp,
    autoSubmitFields: autoSubmitFieldsProp,
    options,
    ...rest
  } = props;

  const methods = useForm({
    mode: "onTouched",
    ...options,
  });

  const changeHandlers = useRef<WatchField[]>([]);
  const autoSubmitFields = useRef<WatchField[]>([]);

  const [autoSubmit, updateAutoSubmit] = useState(autoSubmitProp);

  const updateChangeHandlers = useCallback(
    (newHandlers: WatchField[]) =>
      (changeHandlers.current = [...changeHandlers.current, ...newHandlers]),
    []
  );

  const updateAutoSubmitFields = useCallback(
    (newFields: WatchField[]) =>
      (autoSubmitFields.current = [...autoSubmitFields.current, ...newFields]),
    []
  );

  useEffect(() => {
    if (changeHandlersProp) {
      updateChangeHandlers(changeHandlersProp);
    }
  }, [changeHandlersProp, updateChangeHandlers]);

  useEffect(() => {
    if (autoSubmitFieldsProp) {
      updateAutoSubmitFields(autoSubmitFieldsProp);
    }
  }, [autoSubmitFieldsProp, updateAutoSubmitFields]);

  useEffect(() => {
    updateAutoSubmit(autoSubmitProp);
  }, [autoSubmitProp]);

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

  const valuesRef = useRef<any | null>(null);
  let defaultValues = props.options.defaultValues;

  useEffect(() => {
    if (
      !methods.formState.isDirty &&
      ((isEmptyObject(valuesRef.current) && !isEmptyObject(defaultValues)) ||
        (Object.keys(valuesRef.current ?? {}).length ===
          Object.keys(defaultValues ?? {}).length &&
          !equals(valuesRef.current, defaultValues)))
    ) {
      reset(defaultValues);
      valuesRef.current = defaultValues;
    }
  }, [defaultValues, methods.formState.isDirty, reset]);

  const onFormSubmit = (values: any) => {
    onSubmit && onSubmit(values);
    return true;
  };

  const debuncedSubmit = useDebouncedCallback((values: any) => {
    onFormSubmit(values);
  }, submitTreshould);

  useEffect(() => {
    let watchSubscriptions = control._subjects.watch.subscribe({
      next: ({ name: ChangingName }: any) => {
        const getLiveValue = (name?: string | string[], defaultValues?: any) =>
          control._getWatch(name, defaultValues, false);
        //@ts-ignore
        if (!control._avoidNotify) {
          if (autoSubmit) {
            let shouldSubmit = ChangingName
              ? !autoSubmitFields.current.length ||
                (autoSubmitFields &&
                  autoSubmitFields.current.some((f) => f.name === ChangingName))
              : true;
            if (shouldSubmit) {
              debuncedSubmit(getLiveValue());
            }
          }

          const fieldsToNotify = new Set(
            ChangingName
              ? [ChangingName]
              : [
                  ...(changeHandlers.current.map((h) => h.name) ?? []),
                  ...(refObj.changeHandlers.getObservers().map((o) => o.name) ??
                    []),
                ]
          ).values();

          for (const fieldName of fieldsToNotify) {
            const _value = getLiveValue(
              fieldName,
              props.options.defaultValues
                ? props.options.defaultValues[fieldName]
                : undefined
            );

            if (methodsRef) {
              refObj.changeHandlers?.emitChange(fieldName, _value);
            }

            let listener = changeHandlers.current.find(
              (f) => f.name === fieldName
            );

            if (listener) {
              listener.handler(_value);
            }
          }
        } else {
          //@ts-ignore
          control._avoidNotify = null;
        }
      },
    });

    return () => watchSubscriptions.unsubscribe();
  }, [
    autoSubmit,
    props.options.defaultValues,
    changeHandlers,
    autoSubmitFields,
    debuncedSubmit,
    control,
    refObj.changeHandlers,
    methodsRef,
  ]);

  const handleFormSubmit = (e: FormEvent) => {
    e.stopPropagation();
    handleSubmit(onFormSubmit)(e);
  };

  const registerAutoSubmitField = useCallback(
    (field: WatchField | WatchField[]) => {
      const _autoSubmitFields = autoSubmitFields.current;
      const fieldValues = makeArray(field).filter(
        (f) => _autoSubmitFields.findIndex((inf) => inf.name === f.name) === -1
      );
      if (fieldValues.length) {
        updateAutoSubmitFields(fieldValues);
      }
    },
    [updateAutoSubmitFields, autoSubmitFields]
  );

  const registerChangeHandler = useCallback(
    (handler: WatchField | WatchField[]) => {
      const _changeHandlers = changeHandlers.current;
      const handlerValues = makeArray(handler).filter(
        (h) => _changeHandlers.findIndex((inh) => inh.name === h.name) === -1
      );

      if (handlerValues.length) {
        updateChangeHandlers(handlerValues);
      }
    },
    [changeHandlers, updateChangeHandlers]
  );

  return (
    <form onSubmit={handleFormSubmit} {...rest}>
      <FormProvider {...methods}>
        <InternalFormContextProvider
          registerAutoSubmitField={registerAutoSubmitField}
          registerChangeHandler={registerChangeHandler}
        >
          {children && children({ ...methods })}
        </InternalFormContextProvider>
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
