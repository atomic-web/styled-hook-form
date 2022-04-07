import { WatchField } from "./types";
import { createContext, PropsWithChildren } from "react";

export interface InternalFormContextValue {
  registerAutoSubmitField: (field: WatchField | WatchField[]) => void;
  registerChangeHandler: (field: WatchField | WatchField[]) => void;
}

export const InternalFormContext = createContext<InternalFormContextValue | null>(
  null
);

export const InternalFormContextProvider: React.FC<
  PropsWithChildren<InternalFormContextValue>
> = (props => {
  const {children} = props;
  return <InternalFormContext.Provider value={props} children={children} />
})