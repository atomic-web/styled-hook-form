import { AxiosError, AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";

export interface PageDataProps<  
  TData,
  TServerData,
  TError = any
> {
  request: string | AxiosRequestConfig;
  lazy?: boolean;
  params?: object;
  searchParam?: string;
  searchParamName?: string;
  orderPropParamName?:string;
  orderDirParamName?:string;
  orderProp?:string;
  orderDir?:string;
  page?: number;
  pageSize?: number;
  pageParamName?: string;
  pageSizeParamName?: string;
  listPropName?: string;
  totalPropName?: string;
  onError?:(err:TError)=>void,
  onResponse?: (data: TServerData,page : number,headers:any) => TData;
  onRequest?:(params: any,headers : any)=>any,
  mockResponse?: (mock :MockAdapter)=>void;
}

export interface PageDataResult<  
  TData,
  TError = any
> {
  data: TData | null;
  loading: boolean;
  page: number;
  error: AxiosError<TError> | undefined;
  total: number,
  hasMore:boolean,
  reset: ()=>void,
  nextPage : ()=>void,
  refresh : ()=>void
}

export enum DataFecthStatus {
  Pending = 0,
  Done = 1,
  Failed = 2,
}

export interface DataFetchInfo<TServerData, TError> {
  page: number;
  status: DataFecthStatus;
  data?: TServerData;
  error?: TError;
  headers?:any
}
