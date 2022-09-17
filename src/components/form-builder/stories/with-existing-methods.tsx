import { DevTool } from "@hookform/devtools";
import { FormBuilderContextProvider } from "context";
import { Box, Button } from "grommet";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FieldView } from "../field-view";
import { FormBuilder } from "../form-builder";
import { FormFieldType } from "../types";

export default {
  title: "Form Builder/WithExistingMethods",
};

const WithExistingMethods = () => {
  const methods = useForm({
    defaultValues: {
      field1: "Value1",
      field2: "Value2",
    },
  });

  const {control} = methods;

  const handleSubmit = ()=>{
     alert(JSON.stringify(methods.getValues()));
  }

  return (
    <FormBuilderContextProvider>
      <Box>
        {control && <DevTool control={control}/>}
        <FormBuilder formMethods={methods} onSubmit={handleSubmit}>
          <FieldView name="field1" label="Field1" type={FormFieldType.Text} />
          <FieldView name="field2" label="Field2" type={FormFieldType.Text} />
          <Button label="Submit" type="submit"/> 
        </FormBuilder>
      </Box>
    </FormBuilderContextProvider>
  );
};

export { WithExistingMethods };
