import { DevTool } from "@hookform/devtools";
import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { useFormMethods } from "components/hooks";
import { Box, Button } from "grommet";

export const Default = () => {
  const { ref, methods } = useFormMethods();

  let fields: FormField[] = [
    {
      name: "topLevel",
      label: "Top Level Value",
      type: FormFieldType.Text,
    },
    {
      mergeToParent: true,
      label: "Sub Info",
      type: FormFieldType.SubForm,
      formProps: {
        fields: [
          {
            name: "subText",
            label: "Sub Text",
            type: FormFieldType.Text,
          }
        ],
      },
    },
  ]; 

  return (
    <Box width="medium">
      <FormBuilder
        ref={ref}
        fields={fields}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
        }}
      >
         
        <Button label="submit" type="submit" />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/SubForm/Default",
};
