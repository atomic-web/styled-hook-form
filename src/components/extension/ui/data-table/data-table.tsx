import { DataTable as GrommetDataTable } from "grommet";
import { DataTableProps } from "./types";


const DataTable  : React.FC<DataTableProps> = (props)=>{
    let {...rest} = props;

    return <GrommetDataTable {...rest}>
    
    </GrommetDataTable>
};

export {DataTable}