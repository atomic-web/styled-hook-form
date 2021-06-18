import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button, Text } from "grommet";
import { commerce } from "faker";
import { ID } from "./utils";

export const InfiniteScroll = () => {
  let fields: FormField[] = [
    {
      name: "productId",
      label: "Product",
      type: FormFieldType.DropDown,
      itemLabelKey: "name",
      itemValueKey: "id",
      defaultValue: 0,
      options: {
        request: "/api/categories",
        searchKey: "queryText",
        extraParams: { blaa: "Blaa" },
        mockResponse: (mock) => {
          mock.onGet("/api/categories").reply(({ params }) => {
            let data = new Array(20)
              .fill(0)
              .map(() => ({ id: ID(), name: commerce.productName() }));
           
              if (params.queryText) {
              data = data.filter(
                (e) =>
                  e.name
                    .toLowerCase()
                    .indexOf(params.queryText.toLowerCase()) >= 0
              );
            }

            return [200, data];
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
        <Text
          margin={{
            vertical: "medium",
          }}
        >
          * Start typing in search box to filter result , but bear in mind that
          as data is fake the search result may differ on each search.
        </Text>
        <Button label="Submit" type="submit" primary />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown/Infinite Scroll",
};
