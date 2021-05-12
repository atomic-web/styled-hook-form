import { ButtonType } from "grommet";

export type LongPressButtonProps = ButtonType & {
     pressCallbackTreshold? : number,
     initialDelay?: number,
     whilePress?: ()=>void,
     onLongPress : ()=>void,
     longPressTreshold?:number
}