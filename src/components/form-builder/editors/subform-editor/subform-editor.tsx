import React from "react";
import { FormField } from "../../../form-builder/types";
import { SubFormEditorProps } from "./types";
import { FormBuilder } from "../../../form-builder/form-builder";
import { Box } from "grommet";

const SubFormEditor: React.FC<FormField<SubFormEditorProps>> = (props) => {

  let { formProps, content, plain } = props;

  return (
    <Box border={!plain} pad={!plain ? "small" : "none"}>
      <FormBuilder {...formProps} partialForm={true}>
        {content}
      </FormBuilder>
    </Box>
  );
};

export { SubFormEditor };
