import React, { useEffect, useMemo, useState } from "react";
import { FormMethodsRef, WatchField } from "../form/types";
import InternalForm from "../form";
import {
  FormBuilderProps,
  FormChildren,
  FormField,
  FormFieldType,
  UseFormBuilderInternalOptions,
} from "./types";
import { useFormContext, UseFormReturn, set } from "react-hook-form";
import { SubFormEditorProps } from "./editors";
import styled from "styled-components";
import { customLayout, gridLayout } from "./layouts";

const StyledFormBuilder = styled.div``;

type FormBuilderInternalProps = Partial<FormBuilderProps>;

const useFormBuilderInternal = function <TModel>(
  options: UseFormBuilderInternalOptions<TModel>
){
  
  const Form = React.forwardRef<FormMethodsRef | null>((_internalProps: FormBuilderInternalProps,ref) => {
    const _props = { ...options, ..._internalProps };

    const {
      autoSubmitTreshould = 500,
      options: formOptions,
      editorWrapComponent,
      fields: fieldsProp,
      layout = "GRID",
      beforeSubmit,
      partialForm,
      autoRender,
      onSubmit,
      columns,
      methods,
      model,
      areas,
      rows,
      ...rest
    } = _props;
    
    let fields = useMemo(
      () =>
        fieldsProp.filter(
          (f) =>
            f.visible === undefined || (f.visible !== undefined && f.visible)
        ),
      [fieldsProp]
    );



    const items = fieldsProp.map((item, index) => ({
      ...item,
      order: item.order ?? index,
    }));

    items.sort((a, b) => a.order! - b.order!);

    const renderLayout = (methods: UseFormReturn, children: FormChildren) =>
      layout === "GRID"
        ? gridLayout<TModel>({
            fields: items,
            methods,
            rows,
            columns,
            areas,
            children,
            options: options.options,
            model : options.model,
            editorWrapComponent,
          })
        : customLayout<TModel>({
            layout,
            children,
            options: options.options,
            model : options.model,
            editorWrapComponent,
            fields: items,
            methods,
          });

   

    let submitTriggers = fields
      .filter((f) => f.submitTrigger)
      .map(
        (f) => ({ name: f.name, defaultValue: f.defaultValue } as WatchField)
      );

    let changeHandlers = fields
      .filter((f) => f.onChange)
      .map(
        (f) =>
          ({
            name: f.name,
            defaultValue: f.defaultValue,
            handler: f.onChange,
          } as WatchField)
      );

    const isPartialForm = partialForm === true; 

    const { children } = _props; 

    const handleSubmit = async (values: any) => {
      let shoudlSubmit: boolean | Promise<boolean> = beforeSubmit
        ? beforeSubmit(values)
        : true;
      if ((shoudlSubmit as any) instanceof Promise) {
        shoudlSubmit = await shoudlSubmit;
      }
      if (shoudlSubmit) {
        onSubmit?.call(null, values);
      }
    };

    const getChildren = (_methods: UseFormReturn) =>
      autoRender && renderLayout ? renderLayout(_methods, children) : children;

    const contextMethods = useFormContext();

    const formBody = isPartialForm
      ? React.createElement(React.Fragment, {}, getChildren(contextMethods))
      : React.createElement(
          InternalForm,
          {
            ...(rest as object),
            options: {
              ...(formOptions ?? {}),
              defaultValues,
            },
            methods,
            submitTreshould: autoSubmitTreshould,
            methodsRef: ref,
            onSubmit: handleSubmit,
            autoSubmit: submitTriggers?.length > 0 ? true : false,
            autoSubmitFields: submitTriggers || [],
            changeHandlers: changeHandlers,
          },
          ({ ...methods }: UseFormReturn) => getChildren(methods)
        );

    return <StyledFormBuilder>{formBody}</StyledFormBuilder>;
  });

  return { Form };
};

export { useFormBuilderInternal };
