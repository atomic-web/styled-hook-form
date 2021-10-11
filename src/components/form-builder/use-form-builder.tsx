import { FormField } from "components";
import React, { useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { renderField } from "./layouts/shared";
import { FormFieldViews, UseFormBuilderOptions } from "./types";
import { useFormBuilderInternal } from "./use-form-builder-internal";
import { Box } from "grommet";

const useFormBuilder = function <TModel extends FieldValues = FieldValues>(
  options: UseFormBuilderOptions<TModel>
) {
  let {
    autoSubmitTreshould = 500,
    options: formOptions,
    editorWrapComponent,
    fields: fieldsProp,
    layout = "GRID",
    beforeSubmit,
    partialForm,
    autoRender = false,
    onSubmit,
    columns,
    areas,
    model,
    rows,
    ref: ref,
  } = options;

  const plainFields = Object.values<FormField>(fieldsProp);

  const createFieldViews = (
    viewFactory: (fieldName: keyof TModel) => React.ReactNode
  ) =>
    ((Object.keys(fieldsProp) as unknown) as (keyof TModel)[]).reduce(
      (p: FormFieldViews<TModel>, key: keyof TModel) => {
        p[key] = viewFactory(key);
        return p;
      },
      {} as FormFieldViews<TModel>
    );

  let fieldViews = createFieldViews((fieldName: keyof TModel) => {
    const field = fieldsProp[fieldName];
    const fieldView = renderField(
      field,
      null,
      editorWrapComponent,
      model,
      formOptions?.shouldUnregister
    );
    return fieldView;
  });

  const formResult = useFormBuilderInternal({
    options: formOptions,
    editorWrapComponent,
    autoSubmitTreshould,
    fields: plainFields,
    autoRender,
    beforeSubmit,
    partialForm,
    onSubmit,
    columns,
    layout,
    areas,
    model,
    rows,
    ref,
  });

  return { ...formResult, fieldViews };
};

export { useFormBuilder };
