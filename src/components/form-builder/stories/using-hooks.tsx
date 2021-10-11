import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { FormBuilderContextProvider } from "../../../index";
import { FormBuilderProps, FormFieldType } from "../types";
import { Box, Button } from "grommet";
import { useFormBuilder } from "../use-form-builder";
import { FormField } from "components";

const meta: Meta = {
  title: "Form Builder/Using Hooks",
  args: {},
  component: FormBuilder,
};

export default meta;

type Model = {
  textInput: string;
  textInput2: string;
  textInput3: string;
};

const Template: Story<FormBuilderProps> = () => {
  const fields: FormField[] = [
    {
      name: "textInput",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    },
    {
      name: "textInput2",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    },
    {
      name: "textInput3",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    },
  ];

  const {
    Form,
    fieldViews: { textInput3 },
  } = useFormBuilder<Model>({ fields });

  return (
    <FormBuilderContextProvider>
      <Form
        onSubmit={(data) => {
          alert(JSON.stringify(data));
        }}
        devMode
      >
        <Box fill>
          {textInput3}
          <Button
            gridArea="foot"
            type="submit"
            primary
            size="small"
            label="Submit"
            alignSelf="start"
          />
        </Box>
      </Form>
    </FormBuilderContextProvider>
  );
};

export const UsingHooks = Template.bind({});
