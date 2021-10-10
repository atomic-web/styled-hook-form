import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropType } from "types/utils";
import { FormBuilderOptions, FormBuilderProps, FormField } from "../types";
import { renderChildren, renderField } from "./shared";

const renderFieldEditors = ({
  items,
  methods,
  editorWrapComponent,
  model,
  shouldUnregister,
}: {
  items: FormField[];
  methods: any;
  editorWrapComponent: PropType<FormBuilderOptions, "editorWrapComponent">;
  model: any;
  shouldUnregister: boolean | undefined;
}) => {
  return items.map((field) =>
    renderField(field, methods, editorWrapComponent, model, shouldUnregister)
  );
};

const renderCustomLayout = function <TModel>({
  fields,
  methods,
  layout,
  options,
  children,
  editorWrapComponent,
  model,
}: {
  fields: FormField[];
  methods: UseFormReturn;
  layout: React.ReactElement;
  children: PropType<FormBuilderProps<TModel>, "children">;
  editorWrapComponent: PropType<FormBuilderProps<TModel>, "editorWrapComponent">;
  options?: PropType<FormBuilderOptions<TModel>, "options">;
  model?: TModel;
}) {
  let layoutComponent = React.cloneElement(
    layout as React.ReactElement,
    {},
    <>
      {renderFieldEditors({
        items: fields,
        methods,
        editorWrapComponent,
        model,
        shouldUnregister: options?.shouldUnregister,
      })}
      {renderChildren(children as any, methods)}
    </>
  );

  return <> {layoutComponent} </>;
};

export { renderCustomLayout as default };
