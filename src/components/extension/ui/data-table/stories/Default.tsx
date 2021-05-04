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
    render : ({image})=>(
        <Image src={image} width={100} height={100}/>
    )
  },
];

export const Default = () => {
  let [data, setData] = useState<any[]>([]);
  useEffect(() => {
    let _data = new Array(10000).fill(0).map((_) => ({
      name: name.firstName(),
      family: name.lastName(),
      image: image.animals(200, 200),
    }));
    debugger;
    setData(_data);
  }, []);

  return (
    <GHFContextProvider>
      <Box>
        <DataTable data={data} columns={columns}  pin paginate={{
            numberMiddlePages:10
        }} />
      </Box>
    </GHFContextProvider>
  );
};

export default {
  title: "Extensions/DataTable",
};
