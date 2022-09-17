import { DevTool } from "@hookform/devtools";
import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button } from "grommet";
import { useForm } from "react-hook-form";

export const Default = () => {

  const methods = useForm();

  let fields: FormField[] = [
    {
      name: "topLevel",
      label: "Top Level Value",
      type: FormFieldType.Text,
    },
    {
      type: FormFieldType.SubForm,
      formProps: {
        fields: [
          {
            name: "sub.Text",
            label: "Sub Text",
            type: FormFieldType.Text,
            required:true,
          },
          {
            name: "sub.sub2.text",
            label: "Sub Text",
            type: FormFieldType.Text,
            defaultValue:"asdasdsad",
            required:true,
          },
          {
            name: "currency",
            label: "sdfsdf",
            type: FormFieldType.DropDown,
            itemLabelKey: "name",
            itemValueKey: "id",
            options: [
              {
                name: "DOLLAR",
                id: "DOLLAR",
              },
              {
                name: "EURO",
                id: "EURO",
              },
            ],
            defaultValue: "EURO",
            required: true,
          },
        ],
      },
    },
  ]; 

  return (
    <Box width="medium">
      <FormBuilder
        formMethods={methods}
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
