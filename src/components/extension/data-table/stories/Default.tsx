import { DataTable } from "..";
import { name, address, phone, image, datatype } from "faker";
import { Avatar, Box, ColumnConfig, Meter, Stack, Text } from "grommet";
import { SHFContextProvider } from "styled-hook-form";
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

const pageSize = 20;

export const Default = () => {
  return (
    <SHFContextProvider>
      <DataTableContextProvider>
        <DataTable
          primaryKey="id"
          pin
          request={{
            url: "/api/employee/list",
          }}
          mockResponse={(m) => {
            m.onGet("/api/employee/list").reply((req) => {
              return new Promise((resolve) => {
                let data = new Array(
                  req.params.page === 5 ? 5 : parseInt(req.params.pageSize)
                )
                  .fill(0)
                  .map((_) => ({
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
          paginate={{
            enabled: true,
            pageSize: pageSize,
            type: "infinite-scroll",
          }}
          onRequestError={() => {}}
          columns={columns}
        />
      </DataTableContextProvider>
    </SHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable/Default",
};
