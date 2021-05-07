import { DataTable } from "../";
import { name, address, phone, image, datatype } from "faker";
import { Avatar, Box, ColumnConfig, Meter, Stack, Text } from "grommet";
import { GHFContextProvider } from "context";

const columns: ColumnConfig<any>[] = [
  {
    property: "id",
    header: "Row",
  },
  {
    property: "row",
    header: "Row",
  },
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
    let dd = id++;
    if (dd == 2) {
      dd++;
      id++;
    }
    return dd;
  };
};

const ID = getId();

export const Default = () => {
  return (
    <GHFContextProvider>
      <Box>
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
                resolve([
                  200,
                  {
                    total: 95,
                    list: new Array(page === 10 ? 5 : 10)
                      .fill(0)
                      .map((_, i) => ({
                        id: ID() + 1,
                        row: datatype.number({
                          min: (page - 1) * 10 + 1,
                          max: page * 10,
                        }),
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
            enabled: true,
            currentPage: 1,
            pageSize: 10,
            pagerOptions: {
              numberMiddlePages: 8
            },
          }}
        />
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable",
};
