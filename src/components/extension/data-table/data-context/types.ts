import React from "react";

export interface DataTableContextModel {
  data?: any[];
  primaryKey: string;
  orderParam: string;
  orderDir: "asc" | "desc";
  currentPage?: number;
  pageSize?: number;
  totalRecords: number;
  contextData?: any;
  syncKey: number;
}

export interface DataTableContextProviderProps {
  options?: Pick<
    DataTableContextModel,
    | "data"
    | "primaryKey"
    | "orderDir"
    | "orderParam"
    | "pageSize"
    | "currentPage"
    | "contextData"
  >;
  children?: React.ReactNode;
}

export type DataTableContextReducerAction =
  | {
    type: "set-data";
    payload: any | any[];
  }
  | {
    type: "add-data";
    payload: any | any[];
  }
  | {
    type: "remove-data";
    payload: string | number | ((data: any) => boolean);
  }
  | {
    type: "update-data";
    payload: any | any[];
  }
  | {
    type: "uptda-data-in-path";
    payload: {
      id: string | number;
      path: string[];
      value: any;
      updaterFunc?: (props: any, value: any) => any;
    };
  }
  | {
    type: "merge-value";
    payload: Partial<DataTableContextModel>;
  }
  | {
    type: "set-order",
    payload: {
      param: string,
      dir: "asc" | "desc"
    }
  }
  | {
    type: "reset-order",
    payload: undefined
  }
  | {
    type: "set-page",
    payload: number
  }
  |
  {
    type: "set-page-size",
    payload: number
  }

export interface DataTableContextProviderValue {
  state: DataTableContextModel;
  dispatch: React.Dispatch<DataTableContextReducerAction>;
}
