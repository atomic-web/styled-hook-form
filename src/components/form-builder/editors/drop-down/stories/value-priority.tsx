import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button } from "grommet";

export const ValuePriority = () => {
  let fields: FormField[] = [
    {
      name: "option",
      label: "Option",
      type: FormFieldType.DropDown,
      tip: (
        <Box width="medium">
          Value provided through the model prop of FormBuilder will override the
          one provided through the defaultValue prop of the FormField
        </Box>
      ),
      options: [
        {
          text: "Opt1",
          value: "opt1",
        },
        {
          text: "Opt2",
          value: "opt2",
        },
        {
          text: "Opt3",
          value: "opt3",
        },
      ],
      defaultValue: "opt2",
      itemLabelKey: "text",
      itemValueKey: "value",
    },
  ];

  const handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  return (
    <Box width="medium">
      <FormBuilder
        fields={fields}
        onSubmit={handleSubmit}
        model={{
          option: "opt3",
        }}
      >
        <Button label="Submit" primary type="submit" />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown/Value Priority",
};
