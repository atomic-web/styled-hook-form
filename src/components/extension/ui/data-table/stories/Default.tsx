import { DataTable } from "../";
import { name, address, phone, image, datatype } from "faker";
import { Avatar, Box, ColumnConfig, Meter, Stack, Text } from "grommet";
import { GHFContextProvider } from "context";

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
            m.onGet("/api/employee/list").reply((req) => {
              alert(JSON.stringify(req.params));
              return new Promise((resolve) => {
                resolve([
                  200,
                  {
                    list: new Array(10).fill(0).map((_) => ({
                      name: `${name.firstName()} ${name.lastName()}`,
                      rem: datatype.number(100),
                      avatar: image.avatar(),
                      phone: phone.phoneNumber(),
                      address: address.streetAddress(),
                    })),
                  },
                ]);
              });
            });
          }}
          onRequestError={(e) => {}}
          data={[]}
          columns={columns}
          paginate={{
            numberItems: 100,
            step: 10,
            page: 5,
            numberMiddlePages: 8,
          }}
        />
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable",
};
