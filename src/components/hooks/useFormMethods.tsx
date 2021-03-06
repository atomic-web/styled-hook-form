import { FormMethodsRef } from "../form/types";
import { useLayoutEffect, useCallback } from "react";
import { MutableRefObject, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface UseFormMethodsReturn {
  methods?: UseFormReturn;
  watchValue: (name: string, defaultValue: any) => any;
  ref: MutableRefObject<FormMethodsRef | null>;
}

export function useFormMethods(): UseFormMethodsReturn {
  const ref = useRef<FormMethodsRef>(null);
  const [methods, setMethods] = useState<UseFormReturn>();

  const useWatchValue = (name: string, defaultValue?: any) => {
    const handleValueChange = useCallback((_value: any) => {
      setValue(_value);
    }, []);

    const [value, setValue] = useState(defaultValue);

    useLayoutEffect(() => {
      if (ref.current) {
        ref.current.changeHandlers.addListener(name, handleValueChange);
      }

      return () => {
        if (ref.current) {
          ref.current.changeHandlers.removeListener(name, handleValueChange);
        }
      };
    }, [handleValueChange, name]);

    return value;
  };

  useLayoutEffect(() => {
    if (ref.current) {
      setMethods(ref.current?.methods);
    }
  }, [ref]);

  return {
    methods,
    watchValue: useWatchValue,
    ref,
  };
}
