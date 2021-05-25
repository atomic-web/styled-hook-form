import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button } from "grommet";
import { name } from "faker";

export const RemoteOptions = () => {
  let fields: FormField[] = [
    {
      name: "job_title",
      label: "Job Title",
      type: FormFieldType.DropDown,
      itemLabelKey: "name",
      itemValueKey: "id",
      defaultValue: 0,
      options: {
        url: "/api/options",
        mockResponse: (mock) => {
          mock.onGet("/api/options").reply(() => {
            return [
              200,
              new Array(10)
                .fill(0)
                .map((_, idx) => ({ id: idx, name: name.jobTitle() })),
            ];
          });
        },
      },
    },
  ];

  return (
    <Box width="medium">
      <FormBuilder
        fields={fields}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
        }}
      >
        <Button label="Submit" type="submit" primary />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown/Remote Options",
};
