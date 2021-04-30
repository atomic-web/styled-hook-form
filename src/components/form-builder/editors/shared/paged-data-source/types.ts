import { AxiosError } from "axios";

export interface PageDataProps<  
  TData,
  TServerData,
  TError = any
> {
  url: string;
  lazy?: boolean;
  params?: object;
  searchParam?: string;
  searchParamName?: string;
  page?: number;
  pageSize?: number;
  pageParamName?: string;
  pageSizeParamName?: string;
  listPropName?: string;
  totalPropName?: string;
  resolve?: (data: TServerData,page : number) => TData;
  mock?: {
    data?: TData;
    error?: TError;
    loading?: boolean;
    response?: Response;
  };
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
  nextPage : ()=>void
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
}
