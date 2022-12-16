import React, { useEffect } from "reactn";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";

import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { useFormData } from "../../hooks/useFormData";
import { useApiGet, createUrl } from "../../hooks/useApi";

const AsyncTable = ({
  cacheKey,
  endpoint,
  columns,
  checkboxKey,
  rowActions,
  sortBy,
  sortDir,
  filters,
  emptyMsg,
  onDataLoad,
  footerRenderer,
  asyncTableRef,
  onCheckedChange,
}) => {
  const { formData, setData } = useFormData({
    sortBy,
    sortDir,
    page: 1,
    limit: 25,
    ...filters,
  });

  const { isLoading, isFetching, data, isError, error } = useApiGet(
    cacheKey,
    endpoint,
    formData,
    {
      staleTime: 1000,
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  useEffect(() => {
    if (!asyncTableRef) {
      return;
    }

    asyncTableRef.current = {
      getQueryUrl: () => {
        return createUrl(endpoint, formData);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncTableRef]);

  useEffect(() => {
    setData({
      sortBy: formData.sortBy,
      sortDir: formData.sortDir,
      page: formData.page,
      limit: formData.limit,
      ...filters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (data && typeof onDataLoad === "function") {
      onDataLoad(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderData = () => {
    if (isError) {
      return <Alert variant="danger">{error.message}</Alert>;
    }

    return (
      <>
        <DataTable
          columns={columns}
          data={data ? data.rows : []}
          checkboxKey={checkboxKey}
          actions={rowActions}
          busy={isLoading || isFetching}
          defaultSort={sortBy && sortDir ? `${sortBy}:${sortDir}` : null}
          emptyMsg={emptyMsg}
          onSortChange={(newSortBy, newSortDir) => {
            setData({ sortBy: newSortBy, sortDir: newSortDir }, true);
          }}
          onCheckedChange={(val) => {
            if (onCheckedChange) {
              onCheckedChange(val);
            }
          }}
        />

        {footerRenderer ? footerRenderer() : null}

        {data ? (
          <Pagination
            page={formData.page}
            limit={formData.limit}
            returnedCount={data.returnedCount}
            totalCount={data.totalCount}
            onPageChange={(newPage) => setData({ page: newPage }, true)}
          />
        ) : null}
      </>
    );
  };

  return renderData();
};

AsyncTable.propTypes = {
  cacheKey: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  checkboxKey: PropTypes.string,
  rowActions: PropTypes.array,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  filters: PropTypes.object,
  emptyMsg: PropTypes.string,
  onDataLoad: PropTypes.func,
  footerRenderer: PropTypes.func,
  onCheckedChange: PropTypes.func,
};

export default AsyncTable;
