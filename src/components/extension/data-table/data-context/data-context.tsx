import React, { createContext, Reducer, useContext, useReducer } from "react";
import { actionImpl } from "./actions";
import {
  DataTableContextModel,
  DataTableContextProviderProps,
  DataTableContextReducerAction,
  DataTableContextProviderValue,
} from "./types";
import {getSyncKey} from './actions/impl'

const defaults: DataTableContextModel = {
  primaryKey: "",
  totalRecords: 0,
  syncKey: 0,
  orderDir : "desc",
  orderParam :"id"
};

const DataTableContext = createContext<DataTableContextProviderValue>({
  state: defaults,
  dispatch: () => {},
});

let reducer = (
  state: DataTableContextModel,
  action: DataTableContextReducerAction
) => actionImpl(state, action);

const DataTableContextProvider: React.FC<DataTableContextProviderProps> = (
  props: DataTableContextProviderProps
) => {
  let { children, options } = props;

  let [state, dispatch] = useReducer<
    Reducer<DataTableContextModel, DataTableContextReducerAction>,
    DataTableContextModel
  >(reducer, { ...defaults, ...options }, (s) => s);
  
  if (!state.syncKey){
     state.syncKey = getSyncKey();
  }

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

const useDataTableContext = () => useContext(DataTableContext);

export { DataTableContext, DataTableContextProvider, useDataTableContext };
