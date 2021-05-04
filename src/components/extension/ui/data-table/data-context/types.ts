import React from "react";

export interface DataTableContextModel {
  data?: any[];
  primaryKey: string;
}

export interface DataTableContextProviderProps {
  data?: any[];
  children: React.ReactNode;
}

export type DataTableContextReducerAction =
  | {
      type: "add";
      payload: any | any[];
    }
  | {
      type: "remove";
      payload: string | number | ((data: any) => boolean);
    }
  | {
      type: "update";
      payload: any | any[];
    };
export interface DataTableContextProviderValue {
  state: DataTableContextModel;
  dispatch: React.Dispatch<DataTableContextReducerAction>;
}
