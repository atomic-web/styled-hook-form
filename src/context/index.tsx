import { createContext, Reducer, useContext, useReducer } from "react";
import { GHFContextModel, GHFContextProviderProps, GHFContextProviderValue } from "./types";
import { UIContextReducerAction } from "./actions/types";
import InvokeAction from "./actions";
import { GHFContextReducerAction } from "./actions/types";

const Defaults: GHFContextModel = {
  translator: (str: string, values?: object) => str,
};

export const UIContext = createContext<GHFContextProviderValue>({
  model: Defaults,
  translate : (str:string,values?:object)=>str
});

export const GHFContextProvider: React.FC<GHFContextProviderProps> = (props) => {
  let { children ,translator } = props;

  const initializer = (state: GHFContextModel): GHFContextModel => {
    return state;
  };

  let [state, dispatch] = useReducer<
    Reducer<GHFContextModel, GHFContextReducerAction>,
    GHFContextModel
  >(
    (state: GHFContextModel, action: UIContextReducerAction) => {
      return InvokeAction(state, action);
    },
    Defaults,
    initializer
  );

  let providerProps: GHFContextProviderValue = {
    translate : 
    model: state,
  };

  return <UIContext.Provider children={children} value={providerProps} />;
};

export const useUIContext = () => useContext(UIContext);
