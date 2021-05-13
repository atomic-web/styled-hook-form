import React from "react";

export interface RemoteDataSource{
    url : string,
    searchKey? : string,
    pageKey? : string,
    pageSizeKey? : string    
}

export interface OptionProps{
    label : React.ReactNode,
    selected : boolean    
}

export interface DropDownProps{
    itemValueKey : string,
    itemLabelKey : string,
    multiple?: boolean,
    options : any[] | RemoteDataSource,
    placeholder? : React.ReactNode,    
    onSearch? : (text:string , options : any[])=> any[],
    renderItem?:<TOption=any>(options : TOption)=>React.ReactNode
}