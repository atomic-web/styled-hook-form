import { useSHFContext } from "../../../context";
import {
  Box,
  DataTable as GrommetDataTable,
  Layer,
  Pagination,
  Select,
  Spinner,
} from "grommet";
import { DataTableProps } from "./types";
import DataTableLoader from "./loader";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { DataTableContextProvider, useDataTableContext } from "./data-context";
import { usePagedData } from "../../utils/paged-data-source";
import DataTableWrap from "./data-table-wrap";

const DataTable: React.FC<DataTableProps> = (props) => {
  let { data, paginate, primaryKey, wrap } = props;
  let tableContext = useDataTableContext();
  let contextOptions: any = {
    data,
    pageSize: paginate?.pageSize ?? Number.MAX_VALUE,
    primaryKey: primaryKey,
    orderDir: "desc",
    orderParam: primaryKey,
  };

  let alreadyContextDefined = tableContext.state.syncKey !== 0;

  const childrenWrap = React.cloneElement(
    wrap ?? <Box />,
    {},
    <DataTableImpl {...props} />
  );

  const children = React.createElement(
    !alreadyContextDefined ? DataTableContextProvider : Fragment,
    !alreadyContextDefined ? contextOptions : {},
    childrenWrap
  );

  useEffect(() => {
    if (alreadyContextDefined) {
      tableContext.dispatch({ type: "merge-value", payload: contextOptions });
    }
  }, []);

  return <>{children}</>;
};

const DataTableImpl: React.FC<DataTableProps> = (props) => {
  let {
    request,
    requestParams,
    mockResponse,
    ssr: perSsr,
    data: dataProp,
    columns,
    onRequest,
    onResponse,
    onRequestError,
    requestParamsConfig: reqParams,
    paginate,
    toolbar,
    ...rest
  } = props;

  let {
    state: {
      currentPage,
      pageSize,
      totalRecords: globalTotalRecords,
      data: globalData,
      syncKey,
      orderDir,
      orderParam,
    },
    dispatch,
  } = useDataTableContext();

  let defaultPaging = {
    enabled: false,
    pageSize: 50,
    currentPage: 0,
  };

  let requestParamsConfig = {
    ...DataTable.defaultProps!.requestParamsConfig,
    ...reqParams,
  };

  let {
    config: { ssr: globalSSR },
  } = useSHFContext();

  let ssrEnabled = perSsr !== undefined ? perSsr : globalSSR;

  let internalReqParams = useMemo(() => {
    return {
      ...requestParams,
    };
  }, [requestParams]);

  let {
    error,
    refresh: refreshCurrentPage,
    loading,
    nextPage,
    hasMore,
  } = request
    ? usePagedData({
        request,
        params: internalReqParams,
        orderDir: orderDir,
        orderProp: orderParam,
        orderDirParamName: requestParamsConfig.orderDirParamName,
        orderPropParamName: requestParamsConfig.orderPropParamName,
        listPropName: requestParamsConfig.listPropName,
        pageParamName: requestParamsConfig.pageNumParamName,
        pageSizeParamName: requestParamsConfig.pageSizeParamName,
        pageSize,
        totalPropName: requestParamsConfig.totalPropName,
        onRequest: (data: any, headers: any) => {
          return onRequest ? onRequest(data, headers) : data;
        },
        onResponse: (_data: any, _, headers: any) => {
          dispatch({
            type: "merge-value",
            payload: {
              totalRecords: _data[requestParamsConfig.totalPropName!],
            },
          });

          let cdata = onResponse ? onResponse(_data, headers) : _data;
          const dataList = cdata[reqParams?.listPropName ?? "list"];

          if (paginate?.type === "infinite-scroll") {
            dispatch({
              type: "set-data",
              payload: [...(globalData || []), ...dataList],
            });
          } else {
            dispatch({
              type: "set-data",
              payload: dataList,
            });
          }

          return cdata;
        },
        mockResponse,
        page: currentPage,
      })
    : useMemo(
        () => ({
          error: null,
          data: [],
          refresh: () => 0,
          loading: false,
          nextPage: () => 0,
          hasMore: false,
        }),
        []
      );

  useEffect(() => {
    if (error && onRequestError) {
      onRequestError(error);
    }
  }, [error]);

  useEffect(() => {
    dispatch({
      type: "merge-value",
      payload: { currentPage: paginate?.currentPage ?? 1 },
    });
  }, [paginate?.currentPage]);

  useEffect(() => {
    dispatch({
      type: "set-order",
      payload: { param: props.primaryKey, dir: "desc" },
    });
  }, [props.primaryKey]);

  const handleSort = (_sort: {
    property: string;
    direction: "asc" | "desc";
  }) => {
    dispatch({
      type: "set-order",
      payload: { param: _sort.property, dir: _sort.direction },
    });
  };

  let [totalRecords, setTotalRecords] = useState(50);

  useEffect(() => {
    setTotalRecords(globalTotalRecords);
  }, [globalTotalRecords]);

  useEffect(() => {
    refreshCurrentPage();
  }, [syncKey]);

  useEffect(() => {
    if (dataProp) {
      dispatch({ type: "set-data", payload: dataProp });
    }
  }, [dataProp]);

  const sortValue = useMemo(
    () => ({
      direction: orderDir,
      property: orderParam,
      external: request ? true : false,
    }),
    [orderDir, orderParam, request]
  );

  const btnPagingEnabled =
    paginate && (paginate.type === "button-based" || !paginate.type);
  const isInfiniteScroll = paginate?.type === "infinite-scroll";

  const defaultPageSizeOptions = [pageSize, 10, 20, 50, 100];
  const pageSizeOptions = Array.from(
    new Set(paginate?.pageSizeOptions || defaultPageSizeOptions)
  ) as number[];

  const PaginationView = btnPagingEnabled ? (
    <Box direction="row" align="center" fill="horizontal">
      <Pagination
        onChange={(e) => {
          dispatch({
            type: "merge-value",
            payload: { currentPage: e.page },
          });
        }}
        {...defaultPaging}
        {...paginate?.pagerOptions}
        step={pageSize}
        numberItems={totalRecords}
        page={currentPage}
        key={currentPage}
      />
      {paginate?.showPageSizeOptions && (
        <Box width="6em">
          <Select
            //@ts-ignore
            value={pageSize}
            options={pageSizeOptions}
            onChange={(e) => {
              dispatch({
                type: "merge-value",
                payload: { pageSize: parseInt(e.target.value) },
              });
            }}
          />
        </Box>
      )}
    </Box>
  ) : null;

  const pagerPosition = btnPagingEnabled
    ? paginate?.pagerPosition || "bottom"
    : "none";

  const handleMoreData = () => {
    if (paginate?.type === "infinite-scroll" && hasMore) {
      nextPage();
    }
  };

  return (
    <>
      {toolbar && <Box>{toolbar}</Box>}
      <Box fill>
        {globalData && (
          <Box>
            {loading && (
              <Layer position="center" modal={false}>
                <Box pad="large" round="small" background="light-3">
                  <Spinner size="medium" />
                </Box>
              </Layer>
            )}
            {btnPagingEnabled &&
              (pagerPosition === "top" || pagerPosition === "both") &&
              PaginationView}
            {
              <DataTableWrap isInfiniteScroll={isInfiniteScroll} fill="horizontal">
                <GrommetDataTable
                  {...rest}
                  columns={columns}
                  data={globalData}
                  paginate={false}
                  sort={sortValue}
                  onSort={handleSort}
                  onMore={isInfiniteScroll ? handleMoreData : undefined}
                  step={paginate?.pageSize ?? props.step ?? Number.MAX_VALUE}
                ></GrommetDataTable>
              </DataTableWrap>
            }
            {btnPagingEnabled &&
              (pagerPosition === "bottom" || pagerPosition === "both") &&
              PaginationView}
          </Box>
        )}
        {(!ssrEnabled || !globalData) && <DataTableLoader />}
      </Box>
    </>
  );
};

DataTable.defaultProps = {
  requestParamsConfig: {
    pageSizeParamName: "pageSize",
    pageNumParamName: "page",
    orderDirParamName: "orderDir",
    orderPropParamName: "orderBy",
    totalPropName: "total",
  },
};

export { DataTable };
