import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { FormBuilderContextProvider } from "../../../index";
import { FormBuilderProps, FormFieldType } from "../types";
import { Box, Button } from "grommet";
import { useFormBuilder } from "../use-form-builder";
import { FormField } from "components";
import { useFormMethods } from "components/hooks";
import { DevTool } from "@hookform/devtools";
import { useFormContext } from "react-hook-form";

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
    fieldViews: { textInput3, textInput2 },
  } = useFormBuilder<Model>({ fields });

  const { ref, methods, watchValue } = useFormMethods();

  return (
    <div>
     
      {watchValue("textInput3", 464654)}
      <Form
        onSubmit={(data) => {
          alert(JSON.stringify(data));
        }}
        ref={ref}
      >
         {methods && <DevTool control={methods.control} placement="top-right" />}
        <Box fill> 
          {textInput2}
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
    </div>
  );
};

export const UsingHooks = Template.bind({});
