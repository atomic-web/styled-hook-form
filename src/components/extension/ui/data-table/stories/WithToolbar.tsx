import { GHFContextProvider } from "context";
import { Avatar, Box, ColumnConfig } from "grommet";
import { DataTable } from "../data-table";
import { name, address, phone, image, datatype  } from "faker";

const getId = () => {
    let id = 0;
    return () => {
      return ++id;
    };
  };
  
const ID = getId();

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
      header: "Task Remaining"
    },
  ];

export const WithToolbar = ()=>{

    return  <GHFContextProvider>
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
              let data = new Array(page === 10 ? 5 : 10)
                .fill(0)
                .map((_, i) => ({
                  name: `${name.firstName()} ${name.lastName()}`,
                  username: datatype.number(100),
                  avatar: image.avatar(),
                  phone: phone.phoneNumber(),
                  address: address.streetAddress(),
                  is_cative: address.
                }));
 
              resolve([
                200,
                {
                  total: 95,
                  list: data,
                },
              ]); 
            });
          });
        }}
        onRequestError={(e) => {}}
        columns={columns}
        paginate={{
          enabled: true,
          currentPage: 1,
          pageSize: 10,
          pagerOptions: {
            numberMiddlePages: 8,
          },
        }}
      />
    </Box>
  </GHFContextProvider>
}

export default{
    title : "Extensions/DataTable"
}