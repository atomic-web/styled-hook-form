import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { DataTableProps as GrommetDataTableProps } from "grommet";

export type DataTableProps<
  TServerData = any,
  TData = TServerData
> = GrommetDataTableProps & {
  onRequest?: (params: any, headers: any) => any;
  onResponse?: (data: TServerData, headers: any) => TData;
  onRequestError?:(err:any)=>void,
  request: AxiosRequestConfig | string;
  mockResponse?: (req: MockAdapter) => void;
  ssr?: boolean;
};
