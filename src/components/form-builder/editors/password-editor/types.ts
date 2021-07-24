import { TextEditorProps } from "../text-editor/types";

export interface PasswordEditorProps extends TextEditorProps{
   showPasswordStrength? :boolean,
   minPasswordStrength?: number,
   visibilityToggle? : boolean
}

export interface PasswordStrengthProps{
   password:string,
   onChange : (strength:number)=>void 
}