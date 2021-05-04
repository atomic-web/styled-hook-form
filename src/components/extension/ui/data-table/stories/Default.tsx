import { DataTable } from "../";
import { name, address, date, image } from "faker";
import { Box, ColumnConfig, Image } from "grommet";
import { GHFContextProvider } from "context";
import { useEffect, useState } from "react";

const columns: ColumnConfig<any>[] = [
  {
    property: "name",
    header: "Name",
  },
  {
    property: "family",
    header: "Family",
  },
  {
    property: "image",
    header: "Image",
    render: ({ image }) => <Image src={image} width={100} height={100} />,
  },
];

export const Default = () => {
  return (
    <GHFContextProvider>
      <Box>
        <DataTable
          pin
          request={{
            url: "/api/employee/list",
          }}
          mockResponse={(m) => {
            m.onGet("/api/employee/list").reply(() => {
              return new Promise((res) => {
                setTimeout(() => {
                  res([
                    200,
                    new Array(10000).fill(0).map((_) => ({
                      name: name.firstName(),
                      family: name.lastName(),
                      image: image.animals(200, 200),
                    })),
                  ]);
                }, 1000);
              });
            });
          }}
          onError={(e) => { 
          }}
          data={[]}
          columns={columns}
          paginate={{
            numberMiddlePages: 10,
          }}
        />
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable",
};
