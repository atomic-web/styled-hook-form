import { TextInputProps } from "../text-input/types";

export interface PasswordInputProps extends TextInputProps{
   showPasswordStrength? :boolean,
   minPasswordStrength?: number,
   visibilityToggle? : boolean
}

export interface PasswordStrengthProps{
   password:string,
   onChange : (strength:number)=>void 
}