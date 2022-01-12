import { FormBuilder } from "../../../../form-builder/form-builder";
import { Box, Button } from "grommet";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Save } from "grommet-icons";
import { SHFContextProvider } from "context";

export const CustomLocale = () => {
  const handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  const playersFormFields: FormField[] = [
    {
      name: "numeric_value",
      label: "Numeric Value",
      type: FormFieldType.Number,
      tip:"This is a numeric input with german locale",
      required: true,
    }
  ];

  return (
    <SHFContextProvider options={{ locale: "de", renderGrommet: true }}>
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
    </SHFContextProvider>
  );
};

export default {
  title: "Form Builder/Editors/NumericInput/Custom Locale",
};
