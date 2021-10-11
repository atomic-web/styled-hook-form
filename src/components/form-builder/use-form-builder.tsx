import { FormField } from "components";
import { renderField } from "./layouts/shared";
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

  const plainFields = Object.values<FormField>(fieldsProp);

  let fieldEloements = Object.keys(fieldsProp).reduce((p : Record<string,JSX.Element>,c : string)=>{
      const field = fieldsProp[c];
      const elements = renderField(field,);
  } , {});

  return useFormBuilderInternal({
    editorWrapComponent,
    autoSubmitTreshould,
    fields: plainFields,
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
