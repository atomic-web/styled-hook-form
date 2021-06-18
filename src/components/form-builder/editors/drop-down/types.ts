import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter/types";
import React from "react";
import { SelectProps } from "grommet";

export interface RemoteDataSource {
  request: string | AxiosRequestConfig;
  searchKey?: string;
  pageKey?: string;
  pageSizeKey?: string;
  pageSize?: string;
  extraParams? : any,
  onResponse? : (data :any)=> any,
  listKey?: string,
  totalKey?: string,
  mockResponse? : (req: MockAdapter)=>void
}

export interface OptionProps {
  label: React.ReactNode;
  selected: boolean;
}

export interface DropDownOperations {
  setValue: (setter: (value: any[] | any) => any[] | any) => void;
}

export interface DropDownProps {
  itemValueKey: string;
  itemLabelKey: string;
  labelWrap?: React.ReactElement;
  plainLabel?:boolean;
  renderItemLabel?: <TOption = any>(
    option: TOption,
    operations: DropDownOperations,
    index: number
  ) => React.ReactNode;
  multiple?: boolean;
  options: any[] | RemoteDataSource;
  placeholder?: React.ReactNode;
  onSearch?: (text: string, options: any[]) => any[];
  renderItem?: <TOption = any>(options: TOption) => React.ReactNode;
  selectProps? : SelectProps
}