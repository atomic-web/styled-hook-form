import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { GHFContextProvider } from "../../../index";
import { FormBuilderProps, FormField, FormFieldType } from "../types";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import React, { useState } from "react";
import { useForm, UseFormReturn, useFormState } from "react-hook-form";

const meta: Meta = {
  title: "Form Builder/Overview",
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
    tip: "First Name",
    gridArea: "left",
  },
  {
    label: "Age:",
    name: "age",
    defaultValue: 0,
    type: FormFieldType.Number,
    tip: "Your age",
    gridArea: "left",
  },
  {
    label: "Appointment Date:",
    name: "app_date",
    defaultValue: "",
    type: FormFieldType.Date,
    tip: "Enter your birtdate",
    gridArea: "left",
  },
  {
    label: "Appointment Time:",
    name: "app_time",
    defaultValue: new Date(),
    type: FormFieldType.Time,
    tip: "Enter time of appointment",
    gridArea: "left",
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
    gridArea: "right",
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
    gridArea: "right",
  },

  {
    label: "Agree with terms",
    name: "agree",
    defaultValue: true,
    type: FormFieldType.Boolean,
    tip: "Upload you'r RESUME",
    required: true,
    controlType: "checkbox",
    gridArea: "right",
  },
  {
    name: "sub",
    label: "Detail",
    type: FormFieldType.SubForm,
    gridArea: "right",
    required: true,
    render: (
      base: (children: React.ReactNode, props?: any) => React.ReactNode
    ) => {
      let [showSub, setShowSub] = useState(false);

      return (
        <Box>
          {showSub && (
            <Layer onEsc={() => setShowSub(false)} position="center">
              {base(
                <Box>
                  {
                    <Box direction="row">
                      <Button label="Save" type="submit" />
                      <Button
                        label="cancel"
                        onClick={() => setShowSub(false)}
                      />
                    </Box>
                  }
                </Box>,
                {
                  onSubmit: () => setShowSub(false),
                }
              )}
            </Layer>
          )}
          <Button label="Show Sub Info" onClick={() => setShowSub(true)} />
        </Box>
      );
    },
    formProps: {
      fields: [
        {
          name: "sub-info",
          label: "Sub Info",
          type: FormFieldType.Text,
        },
      ],
    },
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
          start: [1, 0],
          end: [1, 1],
        },
        {
          name: "left",
          start: [0, 0],
          end: [0, 1],
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
