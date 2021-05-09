import { FormBuilder } from "../../../../form-builder/form-builder"
import { Box, Button } from "grommet"
import { FormField, FormFieldType } from "components/form-builder/types";
import {Add} from 'grommet-icons'

const playersFormFields: FormField[] = [
    {
      name: "name",
      label: "Name",
      type: FormFieldType.Text,
      gridArea: "left",
    },
    {
      name: "sex",
      label: "Sex",
      type: FormFieldType.DropDown,
      itemLabelKey: "text",
      itemValueKey: "value",
      multiple:false,
      options: [
        {
          text: "Man",
          value: "man",
        },
        {
          text: "Woman",
          value: "woman",
        },
      ],
      gridArea: "left",
    }        
  ];

export const Simple = ()=>{

    let model = {name: "John Nash" , sex:"man"};

    return <Box width="medium" pad="small" background="light-2">
    <FormBuilder
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
}

export default {
    title :"Form Builder/Editors/DropDown"
}