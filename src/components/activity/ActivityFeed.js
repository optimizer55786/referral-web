import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import Loading from "../common/Loading";
import ActivityItem from "./ActivityItem";
import Pagination from "../common/Pagination";
import { useApiGet } from "../../hooks/useApi";

const ActivityFeed = ({
  objectType,
  objectId,
  filters = {},
  paginate = true,
  footerContent = null,
}) => {
  const [page, setPage] = useState(1);

  const { isLoading, data } = useApiGet(
    `activity-${objectType}-${objectId}`,
    `/activity/${objectType}/${objectId}`,
    { ...filters, page, limit: 25 },
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );

  return (
    <>
      {isLoading ? (
        <Loading msg="Loading activity..." />
      ) : (
        <>
          {data.rows.map((row, i) => (
            <ActivityItem key={i} activity={row} />
          ))}
          {paginate ? (
            <Pagination
              page={page}
              limit={25}
              returnedCount={data.returnedCount}
              totalCount={data.totalCount}
              onPageChange={(newPage) => setPage(newPage)}
            />
          ) : null}
          {footerContent}
        </>
      )}
    </>
  );
};

ActivityFeed.propTypes = {
  objectType: PropTypes.string.isRequired,
  objectId: PropTypes.string.isRequired,
  paginate: PropTypes.bool,
  filters: PropTypes.object,
};

export default ActivityFeed;
