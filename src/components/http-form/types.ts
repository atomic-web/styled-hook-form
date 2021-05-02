import { AxiosRequestConfig } from 'axios';
import React from 'react';
import { FormBuilderProps } from './../form-builder/types';

export type HttpFormProps<TModel=any,TParams=TModel[],TServerData=any,TData=TServerData,TError=any> = Pick<FormBuilderProps,'fields'> & {
   onRequest? : (params:TParams)=>any,
   onResponse? : (data:TServerData)=>TData,
   onError? : (error:TError)=>void,
   onSuccess? : (data:TData)=>void,
   request: AxiosRequestConfig | string,
   loadingIndicator?:()=>React.ReactNode,
   model? : TModel,
   submitButton? : boolean | React.ReactNode
   resetButton? : boolean | React.ReactNode
}