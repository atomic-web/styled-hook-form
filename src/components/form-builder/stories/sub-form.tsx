import { FormBuilderContextProvider } from "../../../context";
import { FieldView, FormBuilder, FormField, FormFieldType } from "..";
import { Button } from "grommet";

export default {
  title: "Form Builder/Sub Form",
};

export const SubForm = () => {
  const subFormFields: FormField[] = [
    {
      name: "subField1",
      label: "Sub Field 1",
      type: FormFieldType.Text,
    },
    {
      name: "subField2",
      label: "Sub Field 2",
      type: FormFieldType.Text,
    },
  ];

  return (
    <FormBuilderContextProvider>
      <FormBuilder>
        <FieldView
          name="topLevel1"
          label="Top level Field 1"
          type={FormFieldType.Text}
        />
        <FieldView
          name="topLevel2"
          label="Top level Field 2"
          type={FormFieldType.Text}
        />
        <FieldView
          name=""
          label=""
          type={FormFieldType.SubForm}
          plain
          formProps={{
            fields: subFormFields,
          }}
        />
        <Button type="submit" label="save"/>
      </FormBuilder>
    </FormBuilderContextProvider>
  );
};
