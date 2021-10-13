import { isEmptyObject } from "components/utils/comp";
import { useEffect, useRef } from "react";
import { set, useForm } from "react-hook-form";
import { FormOptions } from "./types";
import equals from "fast-deep-equal/es6";
import { FormField, FormFieldType, SubFormEditorProps } from "components";
import { useState } from "react";

export const useInternalForm = function <TModel>(
  fields : FormField[],  
  model : TModel,
  options: FormOptions<TModel> & { defaultValues: any }
) {
  const valuesRef = useRef<any | null>(null);
  const methods = useForm({ mode: "onTouched", ...options });
  
  const getAggValues = () => ({
    ...fields
      .reduce(
        (p: FormField[], c: FormField) => [
          ...p,
          ...(c.type === FormFieldType.SubForm
            ? (c as SubFormEditorProps).formProps.fields
            : [c]),
        ],
        []
      )
      .reduce((p: any, c: FormField) => {
        if (c.name) {
          set(p, c.name, c.defaultValue);
        }
        return p;
      }, {}),
    ...model,
  });

  let [defaultValues, setDefautValues] = useState(getAggValues());

  useEffect(() => {
    if (fields) {
      setDefautValues(getAggValues());
    }
  }, [model]);

  useEffect(() => {
    if (
      !methods.formState.isDirty &&
      ((isEmptyObject(valuesRef.current) && !isEmptyObject(defaultValues)) ||
        (Object.keys(valuesRef.current ?? {}).length ===
          Object.keys(defaultValues ?? {}).length &&
          !equals(valuesRef.current, defaultValues)))
    ) {
      valuesRef.current = defaultValues;
      methods.reset(defaultValues);
    }
  }, [defaultValues]);
  return methods;
};
