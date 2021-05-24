import { FormBuilder } from "components/form-builder/form-builder";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Box, Button } from "grommet";
import { useMemo, useState } from "react";
import { RemoteDataSource } from "../types";

const countries = [
  {
    id: 1,
    name: "Australia",
  },
  {
    id: 2,
    name: "Brazil",
  },
  {
    id: 3,
    name: "China",
  },
  {
    id: 4,
    name: "France",
  },
  {
    id: 5,
    name: "Germany",
  },
];

const cities = [
  {
    id: 1,
    cid: 1,
    name: "Sydney",
  },
  {
    id: 2,
    cid: 1,
    name: "Mellbourne",
  },
  {
    id: 3,
    cid: 1,
    name: "Hobart",
  },
  {
    id: 4,
    cid: 2,
    name: "São Paulo",
  },
  {
    id: 5,
    cid: 2,
    name: "Rio De Janeiro",
  },
  {
    id: 6,
    cid: 2,
    name: "Salvador",
  },
  {
    id: 7,
    cid: 3,
    name: "Chicago",
  },
  {
    id: 8,
    cid: 3,
    name: "Wuhan",
  },
  {
    id: 9,
    cid: 3,
    name: "Hong Kong",
  },
  {
    id: 10,
    cid: 4,
    name: "Paris",
  },
  {
    id: 11,
    cid: 4,
    name: "Lyon",
  },
  {
    id: 12,
    cid: 4,
    name: "Lille",
  },
  {
    id: 13,
    cid: 5,
    name: "Munich",
  },
  {
    id: 14,
    cid: 5,
    name: "Berlin",
  },
  {
    id: 15,
    cid: 5,
    name: "Hamburg",
  },
];

export const CascadingSelections = () => {
  let [citiesSource, setCitiesSource] = useState<any[] | RemoteDataSource>([]);

  let fields: FormField[] = [
    {
      name: "country",
      label: "Country",
      type: FormFieldType.DropDown,
      options: countries,
      itemLabelKey: "name",
      itemValueKey: "id",
      onChange: (cid) => {
        setCitiesSource({
          url: "/api/cities",
          extraParams: {
            cid,
          },
          mockResponse: (mock) => {
            mock.onGet("/api/cities").reply(({ params: { cid } }) => {
              return new Promise((res) => {
                setTimeout(() => {
                  res([200, cities.filter((c) => c.cid === cid)]);
                }, 1000);
              });
            });
          },
        });
      },
    },
    {
      name: "province",
      label: "Province",
      type: FormFieldType.DropDown,
      options: citiesSource,
      itemLabelKey: "name",
      itemValueKey: "id",
    },
  ];

  const handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  return (
    <Box width="medium">
      <FormBuilder fields={fields} onSubmit={handleSubmit}>
        <Button label="Submit" type="submit" primary />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown/Cascading Selections",
};
