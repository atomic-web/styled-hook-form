import React, { useEffect, useMemo, useState } from "react";
import { WatchField } from "../form/types";
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

const useFormBuilderInternal = function <TModel>(
  options: UseFormBuilderInternalOptions<TModel>
) {
  let {
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
    model,
    areas,
    rows,
    ref,
  } = options;

  let fields = useMemo(
    () =>
      fieldsProp.filter(
        (f) => f.visible === undefined || (f.visible !== undefined && f.visible)
      ),
    [fieldsProp]
  );

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
          options: formOptions,
          model,
          editorWrapComponent,
        })
      : customLayout<TModel>({
          layout,
          children,
          options: formOptions,
          model,
          editorWrapComponent,
          fields: items,
          methods,
        });

  let [defaultValues, setDefautValues] = useState(getAggValues());

  useEffect(() => {
    setDefautValues(getAggValues());
  }, [model, fields]);

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

  let submitTriggers = fields
    .filter((f) => f.submitTrigger)
    .map((f) => ({ name: f.name, defaultValue: f.defaultValue } as WatchField));

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

  const Form = (_props: FormBuilderProps) => {
    const fixedProps: string[] = [
      "fields",
      "model",
      "onSubmit",
      "beforeSubmit",
      "autoSubmitTreshould",
      "partialForm",
      "options",
      "layout",
      "rows",
      "columns",
      "areas",
      "editorWrapComponent",
      "devMode",
      "ref",
    ];

    const { children } = _props;

    const rest = Object.keys(_props).reduce(
      (p: any, c: string) => (
        !fixedProps.includes(c) && (p[c] = fixedProps.find((x) => x === c)), p
      ),
      {}
    );

    const getChildren = (_methods: UseFormReturn) =>
      autoRender && renderLayout ? renderLayout(_methods, children) : children;

    const formBody = isPartialForm
      ? React.createElement(React.Fragment, {}, getChildren(useFormContext()))
      : React.createElement(
          InternalForm,
          {
            ...(rest as object),
            options: {
              ...(formOptions ?? {}),
              defaultValues,
            },
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
  };

  return { Form };
};

export { useFormBuilderInternal };
