import { FormBuilder } from "../../../../form-builder/form-builder";
import { Box, Button } from "grommet";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Save } from "grommet-icons";
import { useState } from "react";
import { GHFContextProvider } from "context";
import { UseFormReturn } from "react-hook-form";

export const Default = () => {
  const handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  }; 

  const playersFormFields: FormField[] = [
    {
      name: "numeric_value",
      label: "Numeric Value",
      type: FormFieldType.Number,
      required: true,
    },
    {
      name: "with_range",
      label: "With Range (between 10-50)",
      type: FormFieldType.Number,
      min: 10,
      max: 50,
      defaultValue: 9,
    },
    {
      name: "with_custom_validation",
      label: "With Custom Validation",
      type: FormFieldType.Number,
      defaultValue: 9,
      validationRules: {
        validate: (a : any,methods : UseFormReturn) => {
          let x = methods.watch("numeric_value");
          debugger;
          return false;
        },
      },
    },
  ];

  return (
    <GHFContextProvider>
      <Box width="medium" pad="small" background="light-2">
        <FormBuilder fields={playersFormFields} onSubmit={handleSubmit}>
          <Button
            gridArea="actions"
            icon={<Save />}
            label="Submit"
            type="submit"
            primary
          />
        </FormBuilder>
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Form Builder/Editors/NumericInput",
};
