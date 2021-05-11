import { DataTable } from "../";
import { name, address, phone, image, datatype } from "faker";
import { Avatar, Box, ColumnConfig, Meter, Stack, Text } from "grommet";
import { GHFContextProvider } from "../../../../../context";
import { DataTableContextProvider } from "../data-context";

const columns: ColumnConfig<any>[] = [
  {
    property: "avatar",
    header: "Avatar",
    render: ({ avatar }) => <Avatar src={avatar} />,
  },
  {
    property: "name",
    header: "Name",
  },
  {
    property: "phone",
    header: "Phone",
  },
  {
    property: "address",
    header: "Address",
  },
  {
    property: "rem",
    header: "Task Remaining",
    render: ({ rem }) => (
      <Box align="center">
        <Stack anchor="center">
          <Meter
            max={100}
            value={rem}
            type="circle"
            size="xsmall"
            thickness="small"
          />
          <Box direction="row" align="center" pad={{ bottom: "xsmall" }}>
            <Text size="xlarge" weight="bold">
              {rem}
            </Text>
            <Text size="small">%</Text>
          </Box>
        </Stack>
      </Box>
    ),
  },
];

const getId = () => {
  let id = 0;
  return () => {
    return ++id;
  };
};

const ID = getId();

export const Default = () => {
  return (
    <GHFContextProvider>
      <DataTableContextProvider>
        {"Outer Context"}
        <DataTable
          primaryKey="id"
          pin
          request={{
            url: "/api/employee/list",
          }}
          mockResponse={(m) => {
            m.onGet("/api/employee/list").reply((req) => {
              let page = req.params.page;
              return new Promise((resolve) => {
                let data = new Array(page === 10 ? 5 : 10)
                  .fill(0)
                  .map((_, i) => ({
                    id: ID() + 1,
                    name: `${name.firstName()} ${name.lastName()}`,
                    rem: datatype.number(100),
                    avatar: image.avatar(),
                    phone: phone.phoneNumber(),
                    address: address.streetAddress(),
                  }));

                //setTimeout(() => {
                resolve([
                  200,
                  {
                    total: 95,
                    list: data,
                  },
                ]);
                //}, 1000);
              });
            });
          }}
          onRequestError={(e) => {}}
          columns={columns}
        
        />
      </DataTableContextProvider>
    </GHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable/Default",
};
