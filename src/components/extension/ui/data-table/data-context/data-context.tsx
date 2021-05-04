import React, { createContext, Reducer, useContext, useReducer } from "react";
import { actionImpl } from "./actions";
import {
  DataTableContextModel,
  DataTableContextProviderProps,
  DataTableContextReducerAction,
  DataTableContextProviderValue
} from "./types";

const defaults: DataTableContextModel = {
  primaryKey: "",
};

const DataTableContext = createContext<DataTableContextProviderValue>({
  state : defaults,
  dispatch : ()=>{}
});

const DataTableContextProvider: React.FC<DataTableContextProviderProps> = (
  props: DataTableContextProviderProps
) => {
  let { children } = props;

  let reducer = (
    state: DataTableContextModel,
    action: DataTableContextReducerAction
  ) => actionImpl(state, action);

  let [state , dispatch] = useReducer<
    Reducer<DataTableContextModel, DataTableContextReducerAction>,
    DataTableContextModel
  >(reducer, defaults, (s) => s);
  return (
    <DataTableContext.Provider
      children={children}
      value={{
        state,
        dispatch,
      }}
    />
  );
};

const useDataTableContext = ()=> useContext(DataTableContext);

export {DataTableContext , DataTableContextProvider , useDataTableContext}