import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { GHFContextProvider } from "context/index";
import { FormBuilderProps, FormField, FormFieldType } from "../types";
import styled from "styled-components";
import { Box, Button } from "grommet";

const meta: Meta = {
  title: "Overview",
  args: {},
  component: FormBuilder,
};

export default meta;

const fields: FormField[] = [
  {
    label: "First Name:",
    name: "firstname",
    defaultValue: "",
    type: FormFieldType.Text,
    maxLength: 20,
    minLength: 10,
    required: true,
    tip: "First Name",
    gridArea: "right",
  },
  {
    label: "Age:",
    name: "age",
    defaultValue: 0,
    type: FormFieldType.Text,
    required: true,
    tip: "Your age",
    gridArea: "right",
  },
  {
    label: "Appointment Date:",
    name: "app_date",
    defaultValue: "",
    type: FormFieldType.Date,
    required: true,
    minDate: "2021/04/10",
    maxDate: "2021/04/15",
    tip: "Enter your birtdate",
    gridArea: "left",
  },
  {
    label: "Appointment Time:",
    name: "app_time",
    defaultValue: new Date(),
    type: FormFieldType.Time,
    required: true,
    tip: "Enter time of appointment",
    gridArea: "right",
  },
  {
    label: "Programming Language :",
    name: "plang",
    defaultValue: 2,
    type: FormFieldType.DropDown,
    options: [
      {
        name: "C++",
        value: 1,
      },
      {
        name: "Javascript",
        value: 2,
      },
      {
        name: "Go",
        value: 3,
      },
    ],
    itemLabelKey: "name",
    itemValueKey: "value",
    tip: "You'r prefered programming language",
    gridArea: "left",
  },
  {
    label: "Password",
    name: "Password",
    defaultValue: "",
    type: FormFieldType.Password,
    tip: "Choose as passsword",
    showPasswordStrength: true,
    minPasswordStrength: 50,
    required: true,
    gridArea: "left",
  },

  {
    label: "Agree with terms",
    name: "agree",
    defaultValue: true,
    type: FormFieldType.Boolean,
    tip: "Upload you'r RESUME",
    required: true,
    controlType: "checkbox",
    gridArea: "left",
  },
];

const StyledFormBuilder = styled(FormBuilder)`
  background-color: #f1f1f1;
  padding: 2em;
  border-radius: 4px;
  border: solid 1px #aaa;
  width: 900px;
`;

const Template: Story<FormBuilderProps> = (args) => (
  <GHFContextProvider>
    <StyledFormBuilder
      {...args}
      onSubmit={(data) => alert(JSON.stringify(data))}
      rows={["flex", "flex", "5em"]}
      columns={["50%", "50%"]}
      areas={[
        {
          name: "right",
          start: [0, 0],
          end: [0, 1],
        },
        {
          name: "left",
          start: [1, 0],
          end: [1, 1],
        },
        {
          name: "foot",
          start: [0, 2],
          end: [0, 2],
        },
      ]}      
    >
      <Button
        gridArea="foot"
        type="submit"
        primary
        size="small"
        label="Submit"
        alignSelf="start"
      />
    </StyledFormBuilder>
  </GHFContextProvider>
);

export const SampleForm = Template.bind({});

SampleForm.args = {
  fields: fields,
};
