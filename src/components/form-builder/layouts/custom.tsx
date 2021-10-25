import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PropType } from "types/utils";
import { FormBuilderProps, FormField } from "../types";
import { renderChildren, renderField } from "./shared";

const renderFieldEditors = ({
    items,
    methods,
    editorWrapComponent,
    shouldUnregister,
  }: {
    items: FormField[];
    methods: any;
    editorWrapComponent: PropType<FormBuilderProps, "editorWrapComponent">;
    model: any;
    shouldUnregister: boolean | undefined;
  }) => {

  return items.map((field) =>
    renderField(
        field,
        methods,
        editorWrapComponent,
        shouldUnregister
    )
  );
};

const renderCustomLayout = ({
  fields,  
  methods,
  layout,
  options,
  children,
  editorWrapComponent,
  model
}: {
  fields: FormField[];
  methods: UseFormReturn;
  layout: React.ReactElement;
  children : PropType<FormBuilderProps, "children">,
  editorWrapComponent: PropType<FormBuilderProps, "editorWrapComponent">;
  options: PropType<FormBuilderProps, "options">;
  model : any
}) => {
  let layoutComponent = React.cloneElement(
    layout as React.ReactElement,
    {},
    <>
      {renderFieldEditors({
          items: fields, 
          methods,
          editorWrapComponent,
          model,
          shouldUnregister : options?.shouldUnregister
      })}
      {renderChildren(children as any, methods)}
    </>
  );

  return layoutComponent;
};

export { renderCustomLayout as default };
