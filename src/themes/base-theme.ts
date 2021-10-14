import { DefaultTheme } from 'styled-components'
import { ThemeType as GrommetThemeType } from "grommet";

export interface ThemType extends GrommetThemeType {}

export interface ThemeType {
    dateInput? : {
        dateFormat? : string
    }
}

const FormBuilderTheme: DefaultTheme = {
}

export { FormBuilderTheme }