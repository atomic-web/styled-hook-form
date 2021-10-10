import { forwardRef } from "react";
import { FormMethodsRef } from "../form/types";
import { FormBuilderProps } from "./types";
import { UseFormReturn } from "react-hook-form";
import { useFormBuilderInternal } from "./use-form-builder-internal";

export type FormChildProps = UseFormReturn;

const FormBuilder = forwardRef<FormMethodsRef | null, FormBuilderProps>(
  (props, ref) => {
    let {
      autoSubmitTreshould = 500,
      editorWrapComponent,
      fields: fieldsProp,
      layout = "GRID",
      beforeSubmit,
      partialForm,
      children,
      onSubmit,
      options,
      columns,
      areas,
      model,
      rows,
    } = props;

    const { Form } = useFormBuilderInternal({
      editorWrapComponent,
      autoSubmitTreshould,
      fields: fieldsProp,
      autoRender: true,
      beforeSubmit,
      partialForm,
      onSubmit,
      columns,
      options,
      layout,
      areas,
      model,
      rows,
      ref,
    });

    return <Form {...props} children={children}/>;
  }
);

export { FormBuilder };
