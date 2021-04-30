import { TextInputProps } from "../text-input/types";

export interface PasswordInputProps extends TextInputProps{
   showPasswordStrength? :boolean,
   minPasswordStrength?: number
}

export interface PasswordStrengthProps{
   password:string,
   onChange : (strength:number)=>void 
}