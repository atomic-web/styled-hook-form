import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button } from "grommet";

export const Simple = () => {
  let fields: FormField[] = [
    {
      name: "single",
      label: "Single",
      type: FormFieldType.DropDown,
      itemLabelKey: "text",
      itemValueKey: "value",
      options: [
        {
          text: "Option1",
          value: "option1",
        },
        {
          text: "Option2",
          value: "option2",
        },
        {
          text: "Option3",
          value: "option3",
        }
      ],
    },
    {
        name: "multiple",
        label: "Multiple",
        type: FormFieldType.DropDown,
        itemLabelKey: "text",
        itemValueKey: "value",
        multiple:true,
        options: [
          {
            text: "Option1",
            value: "option1",
          },
          {
            text: "Option2",
            value: "option2",
          },
          {
            text: "Option3",
            value: "option3",
          },
        ],
      }
  ];

  return (
    <Box width="medium">
      <FormBuilder
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
  title: "Form Builder/Editors/DropDown/Simple",
};
