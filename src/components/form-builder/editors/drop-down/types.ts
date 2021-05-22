import MockAdapter from "axios-mock-adapter/types";
import React from "react";

export interface RemoteDataSource {
  url: string;
  searchKey?: string;
  pageKey?: string;
  pageSizeKey?: string;
  extraParams? : any,
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
  renderItemLabel?: <TOption = any>(
    options: TOption,
    operations: DropDownOperations,
    index: number
  ) => React.ReactNode;
  multiple?: boolean;
  options: any[] | RemoteDataSource;
  placeholder?: React.ReactNode;
  onSearch?: (text: string, options: any[]) => any[];
  renderItem?: <TOption = any>(options: TOption) => React.ReactNode;
}