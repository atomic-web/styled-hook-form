import { UseFormBuilderOptions } from "./types";
import { useFormBuilderInternal } from "./use-form-builder-internal";

const useFormBuilder = function <TModel>(
  options: UseFormBuilderOptions<TModel>
) {
  let {
    autoSubmitTreshould = 500,
    editorWrapComponent,
    fields: fieldsProp,
    layout = "GRID",
    beforeSubmit,
    partialForm,
    onSubmit,
    options: formOptions,
    columns,
    areas,
    model,
    rows,
    ref: ref,
  } = options;

  return useFormBuilderInternal({
    editorWrapComponent,
    autoSubmitTreshould,
    fields: fieldsProp,
    autoRender: true,
    beforeSubmit,
    partialForm,
    onSubmit,
    columns,
    options: formOptions,
    layout,
    areas,
    model,
    rows,
    ref,
  });
};

export { useFormBuilder };
