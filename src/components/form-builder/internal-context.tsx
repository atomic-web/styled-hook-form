import { FormBuilderProps } from "./types";
import { createContext, PropsWithChildren, useContext } from "react";
import { PropType } from "types/utils";

export interface InternalContextOptions {
  formOptions?: PropType<FormBuilderProps, "options">;
  wrapComponent?: React.ReactElement;
}

export interface InternalContextProviderProps
  extends PropsWithChildren<InternalContextOptions> {}

const InternalContext = createContext({});

const InternalContextProvider: React.FC<InternalContextProviderProps> = (
  props
) => {
  return (
    <InternalContext.Provider value={props}>
      {props.children}
    </InternalContext.Provider>
  );
};

const useInternalContext = () =>
  useContext<InternalContextOptions>(InternalContext);

export { InternalContext, InternalContextProvider, useInternalContext };
