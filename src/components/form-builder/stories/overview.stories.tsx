import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { SHFContextProvider } from "../../../index";
import { FormBuilderProps, FormField, FormFieldType } from "../types";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import React, { useState } from "react";

const meta: Meta = {
  title: "Form Builder/Overview",
  args: {},
  component: FormBuilder,
};

const ResponsiveFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ResponsiveFlexCol = styled.div`
  flex-basis: 25%;
  min-width: 300px;
  flex-basis: 50%;
  box-sizing: border-box;
  padding: 0.5em 1em;
  @media (max-width: 720px) {
    flex-basis: 100%;
  }
`;

export default meta;

const fields: FormField[] = [
  {
    name: "textInput",
    label: "Text Input:",
    defaultValue: "",
    type: FormFieldType.Text,
    maxLength: 20,
    minLength: 10,
    tip: "Plain Text Input",
    gridArea: "left",
  },
  {
    name: "numericInput",
    label: "Numeric Input",
    defaultValue: 0,
    type: FormFieldType.Number,
    tip: "Numbers only",
    gridArea: "left",
  },
  {
    name: "dateVal",
    label: "Date Input",
    defaultValue: "",
    type: FormFieldType.Date,
    tip: "Date Value",
    gridArea: "left",
  },
  {
    name: "password",
    label: "Password",
    defaultValue: "",
    type: FormFieldType.Password,
    tip: "Choose as passsword",
    showPasswordStrength: true,
    minPasswordStrength: 50,
    visibilityToggle:true,
    required: true,
    gridArea: "left",
  },
  {
    name: "boolCheckbox",
    label: "Boolean Input Checkbox",
    defaultValue: true,
    type: FormFieldType.Boolean,
    tip: "Bool input using checkbox",
    required: true,
    controlType: "checkbox",
    gridArea: "left",
  },
  {
    name: "singleList",
    label: "Single Select List",
    defaultValue: 2,
    type: FormFieldType.DropDown,
    options: [
      {
        name: "Male",
        value: 1,
      },
      {
        name: "Female",
        value: 2,
      },
    ],
    itemLabelKey: "name",
    itemValueKey: "value",
    tip: "You are allowed to pick one",
    gridArea: "right",
  },
  {
    name: "multiList",
    label: "Mutiple Select List",
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
    multiple: true,
    tip: "You can choose many",
    gridArea: "right",
  },
  {
    name: "timeVal",
    label: "Time Input:",
    defaultValue: new Date(),
    type: FormFieldType.Time,
    tip: "Time Input",
    gridArea: "right",
  },
  {
    name: "sub",
    label: "Sub Form Editor",
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
          <Button label="Edit Form In Modal" onClick={() => setShowSub(true)} />
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
`;

const Template: Story<FormBuilderProps> = (args) => (
  <SHFContextProvider>
    <StyledFormBuilder
      {...args}
      onSubmit={(data) => alert(JSON.stringify(data))}
      layout={<ResponsiveFlex></ResponsiveFlex>}
      rows={["flex", "flex", "5em"]}
      columns={["50%", "50%"]}
      editorComponent={<ResponsiveFlexCol />}
      devMode
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
      <Box fill>
        <Button
          gridArea="foot"
          type="submit"
          primary
          size="small"
          label="Submit"
          alignSelf="start"
        />
      </Box>
    </StyledFormBuilder>
  </SHFContextProvider>
);

export const Overview = Template.bind({});

Overview.args = {
  fields: fields,
};
