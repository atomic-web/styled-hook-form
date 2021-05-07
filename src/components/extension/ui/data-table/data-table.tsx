import { useGHFContext } from "context";
import { Box, DataTable as GrommetDataTable, Pagination } from "grommet";
import { DataTableProps } from "./types";
import DataTableLoader from "./loader";
import React, { useEffect, useMemo, useState } from "react";
import {
  DataTableContext,
  DataTableContextProvider,
  useDataTableContext,
} from "./data-context";
import { usePagedData } from "components/utils/paged-data-source";
import { PropType } from "../../../../types/utils";

const DataTable: React.FC<DataTableProps> = (props) => {
  let {
    data,
    paginate: { pageSize },
    primaryKey,
  } = props;

  return (
    <Box>
      <DataTableContextProvider
        options={{
          data,
          pageSize: pageSize!,
          primaryKey: primaryKey,
          orderDir:"desc",
          orderParam:primaryKey
        }}
      >
        <DataTableImpl {...props} data={data} />
      </DataTableContextProvider>
    </Box>
  );
};

const DataTableImpl: React.FC<DataTableProps> = (props) => {
  let {
    request,
    requestParams,
    mockResponse,
    ssr: perSsr,
    data,
    columns,
    onRequest,
    onResponse,
    onRequestError,
    requestParamsConfig: reqParams,
    paginate,
    ...rest
  } = props;

  //let [currentPage, setCurrentPage] = useState<number>(0);
  //let [totalRecords, settotalRecords] = useState<number>(0);
  let [sort, setSort] = useState<PropType<DataTableProps, "sort">>(
     {
       direction :"desc",
       property:props.primaryKey
     }
  );

  let defaultPaging = {
    enabled: false,
    pageSize: 50,
    currentPage: 0,
  };

  let requestParamsConfig = {
    ...DataTable.defaultProps,
    ...reqParams,
  };

  let {
    config: { ssr: globalSSR },
  } = useGHFContext();

  let {
    state: { currentPage, totalRecords: globalTotalRecords , data: globalData, syncKey },
    dispatch,
  } = useDataTableContext();

  let ssrEnabled = perSsr !== undefined ? perSsr : globalSSR;

  let internalReqParams = useMemo(() => {
    return {
      ...requestParams,
    };
  }, [requestParams]);

  let { error, data: ServerData,refresh : refreshCurrentPage ,loading } = usePagedData({
    request,
    params: internalReqParams,
    orderDir: sort?.direction,
    orderProp: sort?.property,
    orderDirParamName: requestParamsConfig!.orderDirParamName,
    orderPropParamName: requestParamsConfig!.orderPropParamName,
    onRequest: (data: any, headers: any) => {
      return onRequest ? onRequest(data, headers) : data;
    },
    onResponse: (_data: any, _, headers: any) => {
      dispatch({
        type: "merge-value",
        payload: { totalRecords: _data[requestParamsConfig.totalPropName!] },
      });

      let cdata = onResponse ? onResponse(data, headers) : _data;
      return cdata;
    },
    mockResponse,
    page: currentPage,
  });

  useEffect(() => {
    if (error && onRequestError) {
      onRequestError(error);
    }
  }, [error]);

  useEffect(() => {
    if (ServerData) {
      dispatch({ type: "set-data", payload: ServerData.list });
    }
  }, [ServerData]);

  useEffect(() => {
    if (paginate.currentPage) {
      dispatch({
        type: "merge-value",
        payload: { currentPage: paginate.currentPage },
      });
    }
  }, [paginate.currentPage]);

  useEffect(() => {
    if (!sort) {
      setSort({
        direction: "desc",
        property: props.primaryKey,
      });
    }
  }, [props.primaryKey]);

  const handleSort = (_sort: any) => {
    _sort.external = true;
    setSort(_sort);
    dispatch({
      type: "merge-value",
      payload: { orderParam: _sort.property, orderDir: _sort.direction },
    });
  };

  let [totalRecords, setTotalRecords] = useState(50);

  useEffect(() => {
    setTotalRecords(globalTotalRecords);
  }, [globalTotalRecords]);
 
  useEffect(()=>{
    refreshCurrentPage();
  },[syncKey]);

  return (
    <Box>
      {globalData && (
        <Box>
          <GrommetDataTable
            {...rest}
            columns={columns}
            data={globalData}
            paginate={false}
            sort={sort}
            onSort={handleSort}
            step={paginate.pageSize}
          ></GrommetDataTable>
          {paginate && (paginate.type === "button-based" || !paginate.type) && (
            <Pagination
              onChange={(e) => {
                dispatch({
                  type: "merge-value",
                  payload: { currentPage: e.page },
                });
              }}
              {...defaultPaging}
              {...paginate.pagerOptions}
              step={paginate.pageSize}
              numberItems={totalRecords}
              page={currentPage}
              key={currentPage}
            />
          )}
        </Box>
      )}
      {(!ssrEnabled || !data) && <DataTableLoader />}
    </Box>
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
