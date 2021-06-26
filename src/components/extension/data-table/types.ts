import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { DataTableProps as GrommetDataTableProps, PaginationProps } from "grommet";
import React from "react";

export type DataTableProps<
  TServerData = any,
  TData = TServerData
> = Omit<GrommetDataTableProps,'paginate'|'primaryKey'> & {
  primaryKey:string,
  onRequest?: (params: any, headers: any) => any;
  onResponse?: (data: TServerData, headers: any) => TData;
  onRequestError?:(err:any)=>void,
  request?: AxiosRequestConfig | string;
  requestParams?:any,
  mockResponse?: (req: MockAdapter) => void;
  ssr?: boolean;
  requestParamsConfig?:{
    orderPropParamName?:string;
    orderDirParamName?:string;
    pageSizeParamName?:string
    pageNumParamName?:string,
    totalPropName?:string,
    listPropName?:string
  },
  paginate?:{
    type?:"button-based" | "infinite-scroll",
    enabled:boolean,
    pageSize?:number,
    currentPage?: number,
    pageSizeOptions? : number[],
    pagerOptions?:Omit<PaginationProps,'numberItems'>
  },
  toolbar? : React.ReactNode,
  wrap?: React.ReactElement
};