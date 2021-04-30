import { FormBuilderProps } from './../form-builder/types';

export interface HttpFormProps extends Pick<FormBuilderProps,'fields'> {
     onRequest? : (data:any)=>any,
     onResponse? : (data:any)=>any
}