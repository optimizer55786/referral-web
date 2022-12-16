import React, { useGlobal } from "reactn";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltUp, faArrowAltDown, faBullseyeArrow } from "@fortawesome/pro-solid-svg-icons";

import { capitalizeWords } from "../../lib/stringHelpers";


const TargetIcon = ({row}) => {
  const [user] = useGlobal("user");
  return(
    row._targeted_users.filter(u=>u.user_id === user.user_id).length ? <FontAwesomeIcon icon={faBullseyeArrow} /> : null
  )
}

const referralSourcesGridProps = {
  columns: [
    {
      key: "referral_source_name",
      header: "Name",
      sortable: true,
      render: (row) => {
        return (
          <Link to={`/referral-sources/${row.referral_source_id}`}>
            {row.referral_source_name} <TargetIcon row={row} />
          </Link>
        );
      },
    },
    {
      key: "referral_source_type",
      header: "Type",
      sortable: true,
      render: (row) => {
        return capitalizeWords(row.referral_source_type);
      },
    },
    {
      key: "referral_source_parent_name",
      sortable: true,
      header: "Parent",
      render: (row) => {
        if (!row.referral_source_parent_id) {
          return null;
        }
        return (
          <Link to={`/referral-sources/${row.referral_source_parent_id}`}>
            {row.referral_source_parent_name}
          </Link>
        );
      },
    },
    {
      key: "_addresses",
      sortable: false,
      header: "Location",
      render: (row) => {
        if (!row._addresses || row._addresses.length === 0) {
          return null;
        }

        const addresses = [
          <Link key={0} to={`/map?location=${row._addresses[0].address_id}`}>
            {`${row._addresses[0].city}, ${row._addresses[0].state}`}
          </Link>,
        ];

        if (row._addresses.length > 1) {
          addresses.push(
            <small key={1}>+{row._addresses.length - 1} more</small>
          );
        }

        return <span>{addresses}</span>;
      },
    },
    {
      key: "_assigned_users",
      sortable: true,
      header: "Assigned To",
      render: (row) => {
        if (!row._assigned_users || row._assigned_users.length === 0) {
          return null;
        }
        return row._assigned_users
          .map((u, i) => (
            <Link key={i} to={`/users/profile/${u.user_id}`}>
              {u.user_name} ({u.business_line_key})
            </Link>
          ))
          .reduce((prev, cur) => [prev, ", ", cur]);
      },
    },
    {
      key: "referral_source_rating",
      header: "Rating",
      sortable: true,
      render: (row) => {
        return row.referral_source_rating;
      },
    },
    {
      key: "mtd",
      sortable: true,
      header: "MTD",
    },
    {
      key: "mtdTrend",
      sortable: true,
      header: "MTD Trend",
      render: (row) => {
        if (!row.mtdTrend) {
          return null;
        } else if (row.mtdTrend < 0) {
          return (
            <Badge size="sm" bg="danger">
              <FontAwesomeIcon icon={faArrowAltDown} /> {row.mtdTrend}%
            </Badge>
          );
        }
        return (
          <Badge size="sm" bg="success">
            <FontAwesomeIcon icon={faArrowAltUp} /> {row.mtdTrend}%
          </Badge>
        );
      },
    },
    {
      key: "ytd",
      sortable: true,
      header: "YTD",
    },
    {
      key: "ytdTrend",
      sortable: true,
      header: "YTD Trend",
      render: (row) => {
        if (!row.ytdTrend) {
          return null;
        } else if (row.ytdTrend < 0) {
          return (
            <Badge size="sm" bg="danger">
              <FontAwesomeIcon icon={faArrowAltDown} /> {row.ytdTrend}%
            </Badge>
          );
        }
        return (
          <Badge size="sm" bg="success">
            <FontAwesomeIcon icon={faArrowAltUp} /> {row.ytdTrend}%
          </Badge>
        );
      },
    },
    {
      key: "calculations.ho_opportunity",
      header: "HO Opp",
      sortable: true,
    },
  ],
};

export default referralSourcesGridProps;
