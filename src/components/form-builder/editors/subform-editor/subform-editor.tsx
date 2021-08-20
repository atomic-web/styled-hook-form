import React from "react";
import { FormField } from "../../../form-builder/types";
import { useSHFContext } from "../../../../context";
import {
  Controller,
  ControllerRenderProps,
  get,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { SubFormEditorProps } from "./types";
import { FormBuilder } from "../../../form-builder/form-builder";
import { Box } from "grommet";
import { useEffect } from "react";
import { useFormMethods } from "../../../hooks";
import { useRef } from "react";

const SubFormEditor: React.FC<FormField<SubFormEditorProps>> = (props) => {
  let vrules = props.validationRules || {};
  const { translate: T } = useSHFContext();

  let {
    name,
    defaultValue: initialValue,
    methods,
    required,
    formProps,
    content,
    children,
    mergeToParent,
    model,
    plain,
    onSubmit,
    label,
  } = props;

  let control = methods?.control;
  const { ref: subFormRef, methods: subFormMethods } = useFormMethods();

  if (required) {
    vrules.required = {
      value: required,
      message: T("required-msg", { name: label }),
    };
  }

  const updateRef = useRef<boolean>(true);

  const mergeValues = (_methods : UseFormReturn, values : Record<string,any>)=>{
    for (const key of Object.keys(values)) {
      _methods?.setValue(key, values[key]);
    }
  }

  let subFormModel = mergeToParent
    ? null
    : formProps.fields.reduce((p: Record<string, any>, c: FormField) => {
        if (c.name) {
          p[c.name] = get(model, c.name);
        }
        return p;
      }, {});

  const fieldNames = formProps.fields
    .filter((f) => f.name !== undefined)
    .map((f) => f.name!);

  const parentValues = useWatch({
    name: fieldNames,
    control: methods?.control!,
    defaultValue: subFormModel!,
  });

  if (mergeToParent) {
    for (let f of fieldNames) {
      methods?.register(f);
    }

    if (mergeToParent) for (let f of formProps.fields) f.submitTrigger = true;
  }

  useEffect(() => {
    if (mergeToParent && parentValues && subFormMethods) {
      const values = parentValues.reduce(
        (p: Record<string, any>, c: any, idx: number) => (
          (p[fieldNames[idx]] = c), p
        ),
        {}
      );
      
      if (updateRef.current){
        mergeValues(subFormMethods,values);
      }
    }
  }, [parentValues]);

  const formBuilder = (field?: ControllerRenderProps) => {
    let formActualProps = {
      ...formProps,
      model: subFormModel ?? field?.value,
      onSubmit: (values: any) => {debugger
        if (mergeToParent) {
          updateRef.current = false;
          mergeValues(methods!, values);
          updateRef.current = true;
        } else {
          field?.onChange(values);
        }
        onSubmit && onSubmit(values);
      },
      ref: subFormRef,
    };

    const formComponent = React.createElement(
      FormBuilder,
      formActualProps,
      children ?? content
    );

    return (
      <Box border={!plain} pad={!plain ? "small" : "none"}>
        {formComponent}
      </Box>
    );
  };

  return (
    <>
      {mergeToParent && formBuilder()}
      {!mergeToParent && name && (
        <Controller
          name={name}
          defaultValue={initialValue}
          rules={vrules as any}
          control={control}
          render={({ field }) => formBuilder(field)}
        />
      )}
    </>
  );
};

export { SubFormEditor };
