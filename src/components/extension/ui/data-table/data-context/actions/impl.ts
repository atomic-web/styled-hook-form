import { DataTableContextModel, DataTableContextReducerAction } from "../types";
import { Map } from "immutable";

const getSyncKey = ()=> (new Date()).getTime();

const findOrderedIndex = (
  list: any[],
  primaryKey: string,
  obj: any,
  currentPage : number,
  orderDir: string = "asc",
  orderParam?: string
) => {
  let id_prop = orderParam ?? primaryKey;
  let sortedList = list.sort((a, b) => {
    return typeof a[id_prop] === "number"
      ? a - b
      : (orderDir === "asc"
      ? ("" + a[id_prop]).localeCompare(b[id_prop])
      : ("" + b.attr).localeCompare(a.attr));
      
  }) as any;
  for (let i = 0; i < sortedList.length; i++) {
    let match =
      orderDir === "asc"
        ? obj[id_prop] < sortedList[i][id_prop]
        : obj[id_prop] > sortedList[i][id_prop];
    if (match) {  
      return i > 0 ? i : currentPage === 1 ? 0 : -1;
    }
  }
  return list.length;
};

const removeData = (
  state: DataTableContextModel,
  payload: number | string | ((data: any) => boolean)
) => {
  let newItems = (state.data ?? []).filter((item) => {
    let key = item[state.primaryKey];
    let match =
      typeof payload === "number" || typeof payload === "string"
        ? key === payload
        : payload(item);
    return !match;
  });
  
  return {
    ...state,
    data: newItems,
    syncKey : getSyncKey()
  };
};

const updateData = (state: DataTableContextModel, payload: any | any[]) => {
  let itemsToUpdate = Array.isArray(payload) ? payload : [payload];

  let newItems = (state.data || []).map((item) => {
    let key = item[state.primaryKey];
    let match = itemsToUpdate.find((e) => e[state.primaryKey] === key);
    return match ?? item;
  });

  return {
    ...state,
    data: newItems,
  };
};

const addData = (state: DataTableContextModel, payload: any | any[]) => {
  let items = Array.isArray(payload) ? payload : [payload];
  let newList = state.data || [];
  let prevPageItems = 0;
  for (let item of items) {
    let idx = findOrderedIndex(
      newList,
      state.primaryKey,
      item,
      state.currentPage!,
      state.orderDir,
      state.orderParam
    );
    if (idx >= 0) {
      newList.splice(idx, 0, item);
      newList = newList.slice(0,state.pageSize!);
    }else{
      prevPageItems++;
    }
  }
  let result = {
    ...state,
    data: [...newList],
    totalRecords : state.totalRecords + items.length
  } as any;
  
  if (prevPageItems){
    result.neg_dirty = (result.neg_dirty ?? 0) + prevPageItems;
  }

  if (result.neg_dirty === state.pageSize){
      result.neg_dirty = 0;
      result.currentPage ++;
  }   
debugger
  return result;
};

const setData = (state: DataTableContextModel, payload: any | any[]) => {  
  let items = Array.isArray(payload) ? payload : [payload];
  return {
    ...state,
    data: items,
  };
};

function updateInPath<TProp, TValue>(
  obj: any,
  path: string[],
  value: TValue,
  updateFunc: (prop: TProp, value: TValue) => TProp
): any {
  let state = Map(obj as any);
  let new_state = state.updateIn(path, (prop) => updateFunc(prop, value));
  return new_state.toObject() as any;
}

const mergeValue = (
  state: DataTableContextModel,
  payload: Partial<DataTableContextModel>
) => ({
  ...state,
  ...payload,
});

const updateDataInPath = (
  state: DataTableContextModel,
  {
    id,
    path,
    value,
    updaterFunc,
  }: {
    id: string | number;
    path: string[];
    value: any;
    updaterFunc?: (props: any, value: any) => any;
  }
) =>
  state.data
    ? state.data.map((item) =>
        item[state.primaryKey] === id
          ? updateInPath(
              item,
              path,
              value,
              updaterFunc ?? ((props, v) => (props = v))
            )
          : item
      )
    : [];

const actionsMap: Record<any, any> = {
  "remove-data": removeData,
  "update-data": updateData,
  "add-data": addData,
  "set-data": setData,
  "merge-value": mergeValue,
  "update-data-in-path": updateDataInPath,
};

export const actionImpl = ((actions) => (
  state: DataTableContextModel,
  action: DataTableContextReducerAction
) => {
  let _action = actions[action.type];

  if (_action) {
    return _action(state, action.payload);
  }

  return state;
})(actionsMap);
