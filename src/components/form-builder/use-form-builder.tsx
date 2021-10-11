import { FormField, UseFormBuilderReturn } from "components";
import React from "react";
import { FieldValues } from "react-hook-form";
import { renderField } from "./layouts/shared";
import { FormFieldViews, UseFormBuilderOptions } from "./types";
import { useFormBuilderInternal } from "./use-form-builder-internal";

const useFormBuilder = function <TModel extends FieldValues = FieldValues>(
  options: UseFormBuilderOptions<TModel>
): UseFormBuilderReturn<TModel> {
  let {
    autoSubmitTreshould = 500,
    options: formOptions,
    editorWrapComponent,
    autoRender = false,
    fields: fieldsProp,
    layout = "GRID",
    beforeSubmit,
    partialForm,
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
  ) => {
    const normalFields = Array.isArray(fieldsProp)
      ? fieldsProp.filter((f) => f.name).map((f) => f.name as keyof TModel)
      : ((Object.keys(fieldsProp) as unknown) as (keyof TModel)[]);

    return normalFields.reduce(
      (p: FormFieldViews<TModel>, key: keyof TModel) => {
        p[key] = viewFactory(key);
        return p;
      },
      {} as FormFieldViews<TModel>
    );
  };

  let fieldViews = createFieldViews((fieldName: keyof TModel) => {
    const field = Array.isArray(fieldsProp)
      ? fieldsProp.find((f) => f.name === fieldName)
      : fieldsProp[fieldName];

    if (field) {
      const fieldView = renderField(
        field,
        null,
        editorWrapComponent,
        model,
        formOptions?.shouldUnregister
      );
      return fieldView;
    }
    return React.Fragment;
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
