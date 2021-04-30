import React from "react";
import Form from "../form";
import styled from "styled-components";
import { FormBuilderProps, FormField } from "./types";
import { EditorMap } from "./editor-map";
import { UseFormReturn } from "react-hook-form";
import WidthEditorWrap from "./editors/shared/editor-wrap";

const StyledFormBuilder = styled.div``;

const renderField = (field: FormField, methods: UseFormReturn<any>) => {
  field.methods = methods;
  let component = React.createElement(EditorMap[field.type], {
    ...((field as unknown) as any),
    key: field.name,
  });

  if (field.renderLabel === undefined){
     field.renderLabel = true;
  }

  return <WidthEditorWrap {...field as any} editorType={field.type}>
      <>
      {field.render !== undefined && field.render(component)}
      {field.render === undefined && component} 
      </>
    </WidthEditorWrap>;
};

const FormBuilder: React.FC<FormBuilderProps> = (props) => {
  let { fields, children, onSubmit, className } = props;

  let defaulValues = fields.reduce((p: any, c: FormField) => {
    p[c.name] = c.defaultValue;
    return p;
  }, {});

  const handleSubmit = (values: any) => {
    onSubmit?.call(null, values);
  };

  let submitTriggers = fields.filter((f) => f.submitTrigger).map((f) => f.name);

  return (
    <StyledFormBuilder className={className}>
      <Form
        defaultValues={defaulValues}
        onSubmit={handleSubmit}
        autoSubmit={submitTriggers?.length > 0 ? true : false}
        watchFor={submitTriggers || []}
      >
        {({ ...methods }) => (
          <>
            {fields.map((field) => renderField(field, methods))}
            {children}
          </>
        )}
      </Form>
    </StyledFormBuilder>
  );
};

export { FormBuilder };
