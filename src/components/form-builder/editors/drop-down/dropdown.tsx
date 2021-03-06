import React, { Fragment, useMemo, MouseEvent, useRef } from "react";
import { forwardRef, useCallback, useEffect, useState, memo } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useWatch,
} from "react-hook-form";
import { DropDownProps, OptionProps, RemoteDataSource } from "./types";
import { Box, BoxProps, Button, CheckBox, Select, Text } from "grommet";
import { FormField } from "../../types";
import { Spinner } from "grommet";
import { usePagedData } from "../../../utils/paged-data-source";
import { useFormBuilderContext } from "../../../../context";
import styled from "styled-components";
// @ts-ignore
import { inputStyle } from "grommet/utils/styles";
import { useDebouncedCallback } from "use-debounce";
import { Close } from "grommet-icons";
import { omit, equals } from "remeda";

const MultipleOption = memo((props: OptionProps) => {
  let { label, selected } = props;
  return (
    <Box direction="row" gap="small" align="center" pad="xsmall">
      <CheckBox tabIndex={-1} checked={selected} onChange={() => {}} />
      {label}
    </Box>
  );
});

const SingleOption = memo((props: OptionProps) => {
  let { label, selected } = props;
  return (
    <Box
      direction="row"
      gap="small"
      align="center"
      pad="xsmall"
      background={selected ? "brand" : "light-1"}
    >
      {label}
    </Box>
  );
});

const LabelBox = styled(Box).attrs({
  direction: "row",
})<{ plainLabel?: boolean }>`
  ${({ plainLabel }) => !plainLabel && inputStyle}
  border:none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const DefaultOptionLabel = ({ content }: { content: string }) => (
  <span> {content} </span>
);

const DropDown = React.memo(
  forwardRef<HTMLButtonElement, FormField<DropDownProps>>((props, ref) => {
    let vrules = props.validationRules || {};
    const { translate: T } = useFormBuilderContext();

    let {
      name,
      label,
      options,
      methods,
      required,
      multiple,
      onSearch,
      itemLabelKey,
      itemValueKey,
      placeholder,
      labelWrap,
      renderItem,
      renderItemLabel,
      plainLabel,
      selectProps,
      shouldUnregister,
      defaultValue: initialValue,
      searchDebounce = 500,
    } = props;

    let [localValue, setLocalValue] = useState<any[] | null>(null);
    let [localOptions, setLocalOptions] = useState<any[]>([]);
    let [remoteOptions, setRemoteOptions] = useState<any[]>([]);
    let [remoteSearchKey, setRemoteSearchKey] = useState<string>("");

    let dataSourceOptions: RemoteDataSource | null = useMemo(() => {
      return (options as object).hasOwnProperty("request")
        ? ((options as unknown) as RemoteDataSource)
        : null;
    }, [options]);

    const params = useMemo(() => {
      return {
        ...(typeof dataSourceOptions?.request !== "string"
          ? dataSourceOptions?.request?.params
          : {}),
        ...dataSourceOptions?.extraParams,
      };
    }, [dataSourceOptions?.extraParams, dataSourceOptions?.request]);

    let { loading = false, nextPage = null, hasMore = null } = usePagedData({
      request: dataSourceOptions?.request,
      pageParamName: dataSourceOptions?.pageKey,
      pageSizeParamName: dataSourceOptions?.pageSizeKey,
      pageSize: dataSourceOptions?.pageSize,
      searchParamName: dataSourceOptions?.searchKey,
      searchParam: remoteSearchKey,
      listPropName: dataSourceOptions?.listKey,
      totalPropName: dataSourceOptions?.totalKey,
      params: params,
      mockResponse: dataSourceOptions?.mockResponse,
      onRequest: (data: any, headers: any) => {
        if (dataSourceOptions?.onRequest) {
          data = dataSourceOptions.onRequest(data, headers);
        }
        return data;
      },
      onResponse: (data: any[], page: number, headers: any) => {
        if (dataSourceOptions?.onResponse) {
          data = dataSourceOptions.onResponse(data, headers);
        }
        if (!Array.isArray(data)) {
          data = data[dataSourceOptions?.listKey ?? "list"];
        }
        setRemoteOptions((oldOptions) => {
          let newOptions = [...(page > 1 ? oldOptions : []), ...data];
          return newOptions;
        });
        return data;
      },
    });

    let control = methods?.control;

    if (required) {
      vrules.required = {
        value: required,
        message: T("required-msg", { name: label }),
      };
    }

    useEffect(() => {
      setLocalOptions(options instanceof Array ? options : []);
    }, [options]);

    let liveValue = useWatch({
      name: name!,
      control: methods!.control,
      defaultValue: initialValue,
    });

    let actualOptions = useMemo(
      () => (dataSourceOptions ? remoteOptions ?? [] : localOptions),
      [dataSourceOptions, remoteOptions, localOptions]
    );

    const getOptionsByValue = useCallback((options: any[], value: any[] | any): any[] => {
      return options.filter((o) =>
        Array.isArray(value)
          ? value.some(
              (v) =>
                v === o[itemValueKey] || v[itemValueKey] === o[itemValueKey]
            )
          : value === o[itemValueKey] || value === o
      );
    },[itemValueKey]);

    const liveValueRef = useRef(null);

    const updateLocalValue = useCallback(() => {
      setLocalValue(getOptionsByValue(actualOptions, liveValue));
      liveValueRef.current = liveValue;
    },[actualOptions, getOptionsByValue, liveValue]);

    useEffect(() => {
      if (
        actualOptions &&
        (!liveValueRef.current ||
          JSON.stringify(liveValueRef.current) !== JSON.stringify(liveValue))
      ) {
        updateLocalValue();
      }
    }, [actualOptions, liveValue, updateLocalValue]);

    useEffect(() => {
      if (actualOptions) {
        updateLocalValue();
      }
    }, [actualOptions, updateLocalValue]);

    useEffect(() => {
      if (actualOptions && initialValue) {
        setLocalValue(getOptionsByValue(actualOptions, initialValue));
      }
    }, [actualOptions, getOptionsByValue, initialValue]);

    const handleSearch = useDebouncedCallback((text: string) => {
      if (!dataSourceOptions && text.length === 0) {
        setLocalOptions(options instanceof Array ? options : []);
        return;
      }

      if (dataSourceOptions) {
        setRemoteSearchKey(text);
      } else {
        let filteredOptions: any[];
        if (onSearch) {
          filteredOptions = onSearch(text, localOptions);
        }

        const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

        filteredOptions = localOptions.filter((o) =>
          (o[itemLabelKey] as string).match(new RegExp(escapedText, "gi"))
        );

        setLocalOptions(filteredOptions);
      }
    }, searchDebounce);

    const handleMore = () => {
      if (hasMore) {
        nextPage!();
      }
    };

    const selectDynamicProps: any = {};

    if (dataSourceOptions && loading) {
      selectDynamicProps.icon = <Spinner />;
    }

    const handleChange = useCallback(
      (field: ControllerRenderProps<FieldValues>) => (e: any) => {
        setLocalValue(e.value);
        field.onChange(
          multiple
            ? e.value.map((v: any) => v[itemValueKey])
            : e.value[itemValueKey]
        );
      },
      [itemValueKey, multiple]
    );

    let selectContent = (option: any) => {
      let selectedValues = localValue;

      let opt_value = option[itemValueKey],
        opt_label = option[itemLabelKey];

      const selected = selectedValues
        ? Array.isArray(selectedValues)
          ? selectedValues.findIndex((v) => v[itemValueKey] === opt_value) !==
            -1
          : selectedValues[itemValueKey] === opt_value
        : false;

      return multiple ? (
        <MultipleOption
          label={
            renderItem ? (
              renderItem(option, selected)
            ) : (
              <DefaultOptionLabel content={opt_label} />
            )
          }
          selected={selected}
        />
      ) : renderItem ? (
        renderItem(option, selected)
      ) : (
        <SingleOption selected={selected} label={opt_label} />
      );
    };

    const valueLabel = () => {
      const handleClear = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setLocalValue(null);
        if (methods) {
          methods.setValue(name!, null);
        }
      };

      const isEmpty = (value: any) =>
        Array.isArray(value) ? !value.length : !value;

      let _value: any[] = localValue
        ? Array.isArray(localValue)
          ? localValue
          : [localValue]
        : [];

      let labels = (
        <Box direction="row" justify="between" align="center" fill="horizontal">
          <LabelBox plainLabel={plainLabel} fill="horizontal">
            {_value && _value.length ? (
              _value.map((val: any, idx: number) => (
                <Fragment key={val[itemValueKey]}>
                  {renderItemLabel ? (
                    renderItemLabel!(
                      val,
                      {
                        setValue: (
                          setter: (prev: any[] | any) => any[] | any
                        ) => {
                          let transformedValue = setter(_value);
                          methods!.setValue(name!, transformedValue);
                          setLocalValue(transformedValue);
                        },
                      },
                      idx
                    )
                  ) : (
                    <>
                      <Text>{val[itemLabelKey]}</Text>
                      {localValue!.length - 1 > idx && <span>,</span>}
                    </>
                  )}
                </Fragment>
              ))
            ) : (
              <Text>{placeholder ?? T("drop-down-plcaholder")}</Text>
            )}
          </LabelBox>
          {selectProps?.clear && !isEmpty(localValue) && (
            <Button
              focusIndicator={false}
              icon={<Close size="small" onClick={handleClear} />}
            />
          )}
        </Box>
      );

      let wrapElement = labelWrap
        ? React.cloneElement(labelWrap, {}, labels)
        : React.createElement(
            Box,
            {
              direction: "row",
              overflow: "hidden",
              fill: "horizontal",
              wrap: true,
            } as BoxProps,
            labels
          );

      return wrapElement;
    };

    return (
      <Controller
        name={name!}
        defaultValue={initialValue}
        shouldUnregister={shouldUnregister}
        rules={vrules as any}
        control={control}
        render={({ field }) => (
          <Select
              {...selectProps}
              closeOnChange={!multiple}
              ref={ref as any}
              multiple={multiple}
              valueLabel={valueLabel()}
              options={actualOptions}
              option
              labelKey={itemLabelKey}
              valueKey={itemValueKey}
              onSearch={handleSearch}
              onMore={handleMore}
              onChange={handleChange(field)}
              value={localValue ?? []}
              emptySearchMessage={T("drop-down-search-empty-msg")}
              clear={false}
              {...selectDynamicProps}
            >{selectContent}</Select>
        )}
      ></Controller>
    );
  }),
  (prev, next) => {
    const eq = equals(
      omit(prev as any, [
        "methods",
        "children",
        "onChange",
        "onSearch",
        "renderItem",
        "renderItemLabel",
        "render",
      ]),
      omit(next as any, [
        "methods",
        "children",
        "onChange",
        "onSearch",
        "renderItem",
        "renderItemLabel",
        "render",
      ])
    );

    return eq;
  }
);

export { DropDown };
