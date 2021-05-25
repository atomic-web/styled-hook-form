import { FormBuilder } from "../../../../form-builder/form-builder";
import { Box, Button, Text } from "grommet";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Add, Close } from "grommet-icons";

const playersFormFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: FormFieldType.Text,
    gridArea: "left",
  },
  {
    name: "lang",
    label: "Language",
    type: FormFieldType.DropDown,
    itemLabelKey: "text",
    itemValueKey: "value",
    placeholder: "Select a language",
    renderItemLabel: ({ text , value }: any , {setValue}) => {
      const handleRemove = (e : Event) => {
        e.stopPropagation();
        setValue((p)=>p.filter((pv : any)=>pv.value !== value));
      };

      return (
        <Box
          background="brand"
          pad="xsmall"
          round="xsmall"
          margin={{ horizontal: "xxsmall", vertical: "xxsmall" }}
        >
          <Box direction="row" onClick={handleRemove}>
            <Text margin={{ end: "small" }}>{text}</Text>
            <Button
              plain
              icon={
                <Close size="small" style={{ width: "12px", height: "12px" }} />
              }
            ></Button>
          </Box>
        </Box>
      );
    },
    multiple: true,
    options: [
      {
        text: "English",
        value: "english",
      },
      {
        text: "German",
        value: "german",
      },
      {
        text: "Spanish",
        value: "spanish",
      },
      {
        text: "French",
        value: "french",
      },
      {
        text: "Chines",
        value: "chines",
      },
      {
        text: "Japanese",
        value: "japanese",
      },
    ],
    gridArea: "left",
  },
];

export const CustomLabel = () => {
  let model = { name: "John Nash", lang: ["english"] };
  let handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  return (
    <Box width="medium" pad="small" background="light-2">
      <FormBuilder
        onSubmit={handleSubmit}
        fields={playersFormFields}
        model={model}
      >
        <Button
          gridArea="actions"
          icon={<Add />}
          label="Submit"
          type="submit"
          primary
        />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown/Custom Label",
};
