import React, { createContext, ReactNode, useReducer } from "react";
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { FormTheme } from '../themes/base-theme';
import { Grommet } from 'grommet';

export interface WPTheme extends DefaultTheme { };

export interface GHFContextProps {
    children?: ReactNode,
    options?: WPOptions
}
export type DirectionType = "rtl" | "ltr" | undefined;

export interface WPOptions {
    theme?: WPTheme
}

export interface WPAction {
    type: string,
    payload: any
}

const GHFContext = createContext(null);

const GHFContextProvider: React.FC<GHFContextProps> = (props) => {

    const { children, options } = props;

    const _options: WPOptions = {
        ...options
    }

    const reducer = (state: WPOptions, action: WPAction) => {

        return state;
    };

    const _value: any = useReducer(reducer, _options);

    const theme = FormTheme;

    return <GHFContext.Provider value={_value}>
        <Grommet>             
            <ThemeProvider theme={theme}>
                {
                    children
                }
            </ThemeProvider>
        </Grommet>
    </GHFContext.Provider>
}


export {
    GHFContextProvider
}