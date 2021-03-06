/* eslint-disable */
import useAxios, { makeUseAxios } from "axios-hooks";
import MockAdapter from "axios-mock-adapter";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import StaticAxios from "axios";
import { AxiosRequestConfig } from "axios";

import {
  DataFecthStatus,
  DataFetchInfo,
  PageDataProps,
  PageDataResult,
} from "./types";
import { isAxiosCancel } from "../http";

const usePagedData = <
  TListItem = any,
  TData = TListItem[],
  TServerData = TData,
  TError = any
>(
  props: PageDataProps<TData, TServerData, TError>
): PageDataResult<TData, TError> => {
  let {
    request,
    lazy,
    params,
    onResponse,
    onRequest,
    mockResponse,
    listPropName = "list",
    totalPropName = "total",
    searchParam,
    searchParamName = "searchKey",
    page: _page = 1,
    pageSize = 20,
    pageParamName = "page",
    pageSizeParamName = "pageSize",
    orderPropParamName = "order-by",
    orderDirParamName = "order-dir",
    orderProp,
    orderDir = "asc",
  } = props;

  if (lazy === undefined || lazy === null) {
    lazy = false;
  }

  if (typeof request === "string") {
    request = {
      url: request,
    };
  }

  let [page, setPage] = useState<number>(_page);
  let [total, setTotal] = useState<number>(0);
  let [hasMore, setHasMore] = useState<boolean>(false);
  let [isFirstLoad, setIsFirstLoad] = useState(true);
  const reqRef = useRef<string | AxiosRequestConfig>();

  let [currentFetch, setCurrentFetch] = useState<DataFetchInfo<
    TServerData,
    TError
  > | null>(null);

  const requestParams = useMemo((): object => {
    let _params: Record<string, any> = {
      ...params,
      [pageSizeParamName]: pageSize,
    };

    if (searchParam) {
      _params[searchParamName] = searchParam;
    }

    if (orderProp) {
      _params[orderPropParamName] = orderProp;
      _params[orderDirParamName] = orderDir;
    }
    return _params;
  }, [
    pageSizeParamName,
    pageSize,
    searchParamName,
    searchParam,
    orderPropParamName,
    orderDirParamName,
    orderProp,
    orderDir,
    params,
  ]);

  if (mockResponse) {
    let mock = new MockAdapter(StaticAxios);
    mockResponse(mock);
  }

  let actualUseAxios = mockResponse
    ? makeUseAxios({
        axios: StaticAxios,
      })
    : useAxios;

  const [{ loading, error }, refetch] = actualUseAxios(
    {
      ...request,
      transformRequest: useCallback((data: any, headers: any) => {
        return onRequest ? onRequest(data, headers) : data;
      }, []),
      transformResponse: useCallback(function (
        _data: TServerData,
        headers: any
      ) {
        let data = typeof _data === "string" ? JSON.parse(_data as any) : _data;
        setCurrentFetch((f: DataFetchInfo<TServerData, TError> | null) => ({
          page: f!?.page,
          data,
          status: DataFecthStatus.Done,
          headers,
        }));

        return (_data as unknown) as TData;
      },
      []),
    },
    { manual: true }
  );

  const handleServerData = (
    data: TServerData,
    page: number,
    headers: any
  ): boolean => {
    let result: TData;
    let list: any[];

    if (onResponse) {
      result = onResponse(data, page, headers);
    } else {
      result = (data as unknown) as TData;
    }

    if (!result) {
      return true;
    }

    if (!Array.isArray(result)) {
      list = (result as any)[listPropName];
    } else {
      list = (result as unknown) as any[];
    }

    if (!list) {
      return false;
    }

    let totalRecords = (result as any)[totalPropName];
    setTotal(totalRecords);

    setHasMore(list.length === pageSize);
    setData(result);
    return true;
  };

  const nextPage = () => {
    setPage((p) => {
      loadPage(lazy && isFirstLoad ? p || 1 : p + 1);
      return p;
    });
  };

  const [data, setData] = useState<TData | null>(null);

  const reset = useCallback(() => {
    loadPage(1);
  },[]);

  const refresh = () => {
    if (isFirstLoad) {
      return;
    }
    setPage((p) => {
      loadPage(p);
      return p;
    });
  };

  const loadPage = (pNum: number) => {
    const newFetch = {
      page: pNum,
      status: DataFecthStatus.Pending,
    }; 
    setCurrentFetch(newFetch);
  };

  useEffect(() => {
    if (lazy || request === null || isFirstLoad || !_page) {
      return;
    }

    loadPage(_page);
  }, [_page]);


  useEffect(() => {
    if (currentFetch) {
      if (currentFetch.status === DataFecthStatus.Pending) {
        setCurrentFetch((cf: any) => ({
          ...cf,
          status: DataFecthStatus.InProgress,
        }));
        refetch({
          params: {
            ...requestParams,
            [pageParamName]: currentFetch.page,
          },
        }).catch((err) => {
          if (isAxiosCancel(err)) {
            setCurrentFetch((cf) => ({
              ...(cf as any),
              status: DataFecthStatus.Pending,
            }));
          } else {
            setCurrentFetch((cf) => ({
              ...(cf as any),
              status: DataFecthStatus.Failed,
            }));
          }
        });
      }

      if (currentFetch.status === DataFecthStatus.Done) {
        if (
          handleServerData(
            currentFetch.data!,
            currentFetch.page,
            currentFetch.headers
          )
        ) {
          setIsFirstLoad(false);
          setPage(currentFetch.page);
        }
      }
    }
  }, [currentFetch]);

  useEffect(() => {
    if (!isFirstLoad) {
      reset();
    }
  }, [requestParams]);

  useEffect(() => {
    if (isFirstLoad && request != null && !lazy) {
      loadPage(page);
      reqRef.current = request;
    }
  }, []);

  useEffect(() => {
    if (
      (!reqRef.current && request) ||
      (reqRef.current &&
        JSON.stringify(reqRef.current) !== JSON.stringify(request))
    ) {
      reqRef.current = request;
      reset();
    }
  }, [request, reset]);

  return {
    data,
    loading,
    error,
    page,
    total,
    hasMore,
    nextPage,
    reset,
    refresh,
  };
};

export { usePagedData };
