import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { FormBuilderContextProvider } from "../../../index";
import { FormBuilderProps, FormField, FormFieldType } from "../types";
import styled from "styled-components";
import { Box, Button } from "grommet";
import { useFormBuilder } from "../use-form-builder";

const meta: Meta = {
  title: "Form Builder/Using Hooks",
  args: {},
  component: FormBuilder,
};

export default meta;

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

const StyledFormBuilder = styled(FormBuilder)`
  background-color: #f1f1f1;
  padding: 2em;
  border-radius: 4px;
  border: solid 1px #aaa;
`;

const Template: Story<FormBuilderProps> = () => {
  
  const { Form, fieldViews } = useFormBuilder({ fields });

  return (
    <FormBuilderContextProvider>
      <Form
        onSubmit={(data) => {debugger;alert(JSON.stringify(data))}}
        devMode
      >
        <Box fill>
          {Object.values(fieldViews)}
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

UsingHooks.args = {
  fields: fields,
};
