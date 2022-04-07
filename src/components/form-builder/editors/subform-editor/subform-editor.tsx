import React from "react";
import { FormField } from "../../../form-builder/types";
import { SubFormEditorProps } from "./types";
import { FormBuilder } from "../../../form-builder/form-builder";
import { Box } from "grommet";

const SubFormEditor: React.FC<FormField<SubFormEditorProps>> = (props) => {
  let { formProps, content, plain, shouldUnregister } = props;

  const fields = formProps?.fields ?? [];

  if (fields) {
    fields.forEach((prop) => {
      if (prop.shouldUnregister === undefined) {
        prop.shouldUnregister = shouldUnregister;
      }
    });
  }

  return (
    <Box border={!plain} pad={!plain ? "small" : "none"}>
      <FormBuilder {...formProps} partialForm={true}>
        {content}
      </FormBuilder>
    </Box>
  );
};

export { SubFormEditor };
