import { FormBuilder } from "../../../../form-builder/form-builder";
import { Box, Button, Spinner } from "grommet";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Save } from "grommet-icons";
import { useState } from "react";
import { GHFContextProvider } from "context";
import { UseFormReturn } from "react-hook-form";
import { Checkmark, Close } from "grommet-icons";

export const Default = () => {
  const handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  const [checking, setChecking] = useState<boolean | undefined>(undefined);

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
        validate: () => {
          return new Promise((res) => {
            setChecking(true);
            setTimeout(() => {
              res(true);
              setChecking(false);
            }, 2000);
          });
        },
      },
      render: (
        base,
        methods: UseFormReturn
      ) => {
        return (
          <Box>
            {base({
              inputProps: {
                icon:
                  checking === undefined ? null : checking ? (
                    <Spinner />
                  ) : methods.formState.errors["with_custom_validation"] ? (
                    <Close />
                  ) : (
                    <Checkmark />
                  ),
              },
            })}
          </Box>
        );
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
