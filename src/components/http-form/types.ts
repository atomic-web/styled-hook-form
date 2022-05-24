import { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { FormBuilderProps } from './../form-builder/types';

export type HttpFormCallBack = (data:any,headers:any)=> void;

export type HttpCallBackWithOptionalDeps = HttpFormCallBack | [HttpFormCallBack,unknown []]

export type HttpFormProps<TModel=any,TServerResult=any,TResult=TServerResult,TError=any> =
 Partial<FormBuilderProps> &
 Pick<FormBuilderProps,'fields'> & {
   onSaveRequest?: HttpCallBackWithOptionalDeps,
   onSaveResponse?: HttpCallBackWithOptionalDeps,
   onLoadRequest?: HttpCallBackWithOptionalDeps,
   onLoadResponse?: HttpCallBackWithOptionalDeps,
   onSaveError? : (error:TError)=>void,
   onLoadError? : (error:TError)=>void,
   onSaveSuccess? : (data:TResult)=>void,
   onLoadSuccess? : (data:TResult)=>void,
   saveRequest: AxiosRequestConfig | string,
   loadRequest?: AxiosRequestConfig | string,
   loadingIndicator?:React.ReactNode,
   encodingMode? : "JSON" | "MUTIPART" | "AUTO",
   model? : TModel,
   submitButton? : boolean | React.ReactNode
   resetButton? : boolean | React.ReactNode,
   mockResponse? : (req : MockAdapter)=>void
}