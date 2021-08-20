import { DevTool } from "@hookform/devtools";
import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { useFormMethods } from "components/hooks";
import { Box, Button } from "grommet";
import { useEffect } from "react";

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
          },
          {
            name: "subText2",
            label: "Sub Text",
            type: FormFieldType.Text,
          }
        ],
      },
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      ref.current?.methods?.reset({
        topLevel: "topLevel",
        subText: "subText",
      });
    }, 1000);
  }, []);

  return (
    <Box width="medium">
      <FormBuilder
        ref={ref}
        fields={fields}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
        }}
      >
        {methods?.control && <DevTool control={methods.control} placement="top-right" />}
        <Button label="submit" type="submit" />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/SubForm/Default",
};
