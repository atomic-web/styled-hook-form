import { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { FormBuilderProps } from './../form-builder/types';

export type HttpFormProps<TModel=any,TServerResult=any,TResult=TServerResult,TError=any> =
 Partial<FormBuilderProps> &
 Pick<FormBuilderProps,'fields'> & {
   onRequest? : (model:TModel)=>any,
   onResponse? : (data:TServerResult)=>TResult,
   onError? : (error:TError)=>void,
   onSuccess? : (data:TResult)=>void,
   request: AxiosRequestConfig | string,
   loadingIndicator?:()=>React.ReactNode,
   encodingMode : "JSON" | "MUTIPART" | "AUTO",
   model? : TModel,
   submitButton? : boolean | React.ReactNode
   resetButton? : boolean | React.ReactNode,
   mockResponse? : (req : MockAdapter)=>void
}