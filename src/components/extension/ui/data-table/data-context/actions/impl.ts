import { DataTableContextModel, DataTableContextReducerAction } from "../types";

const remove = (
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
  };
};

const update = (state: DataTableContextModel, payload: any | any[]) => {
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

const add = (state: DataTableContextModel, payload: any | any[]) => {
  let items = Array.isArray(payload) ? payload : [payload];
  return {
    ...state,
    data: [...(state.data || []), ...items],
  };
};


const set = (state: DataTableContextModel, payload: any | any[]) => {
  let items = Array.isArray(payload) ? payload : [payload];
  return {
    ...state,
    data: items,
  };
};


const actionsMap: Record<any, any> = {
  remove,
  update,
  add,
  set
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
