import { FormBuilder } from "../../../../form-builder/form-builder"
import { Box, Button } from "grommet"
import { FormField, FormFieldType } from "components/form-builder/types";
import {Add} from 'grommet-icons'
import { useState } from "react";

const playersFormFields: FormField[] = [
    {
      name: "name",
      label: "Name",
      type: FormFieldType.Text,
      gridArea: "left",
    },
    {
        name: "age",
        label: "Age",
        type: FormFieldType.Number,
        gridArea: "left",
        defaultValue:0
      }         
  ];

export const Simple = ()=>{

    let [model,setModel] = useState({name: "John Nash" , sex:"man"});
    
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
    title :"Form Builder/Editors/NumericInput"
}