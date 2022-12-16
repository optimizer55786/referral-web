import React from "reactn";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { capitalizeWords } from "../../lib/stringHelpers";

const referralsGridProps = {
  columns: [
    {
      header: "Patient",
      key: "patient_name",
      sortable: true,
      render: (row) => (
        <Link to={`/referrals/${row.referral_id}`}>
          {row.patient_name}
        </Link>
      ),
    },
    {
      header: "User",
      key: "user_name",
      sortable: true,
      render: (row) => (
        <Link to={`/system/users/${row.user_id}`}>{row.user_name}</Link>
      ),
    },
    {
      header: "Referral Source",
      key: "referral_source_name",
      sortable: true,
      render: (row) => (
        <Link to={`/referral-sources/${row.referral_source_id}`}>
          {row.referral_source_name}
        </Link>
      ),
    },
    {
      header: "Organization",
      key: "org_name",
      sortable: true,
    },
    {
      header: "Status",
      key: "referral_status",
      sortable: true,
      render: (row) => {
        return capitalizeWords(row.referral_status);
      },
    },
    {
      header: "Referral Date",
      key: "referral_date",
      sortable: true,
      render: (row) =>
        row.referral_date
          ? moment
              .utc(row.referral_date, "YYYY-MM-DD")
              .format("MM/DD/YYYY")
          : "-",
    },
    {
      header: "Start of Care",
      key: "start_of_care_date",
      sortable: true,
      render: (row) =>
        row.start_of_care_date
          ? moment
              .utc(row.start_of_care_date, "YYYY-MM-DD")
              .format("MM/DD/YYYY")
          : "-",
    },
    {
      header: "Discharge",
      key: "discharge_date",
      sortable: true,
      render: (row) =>
        row.discharge_date
          ? moment
              .utc(row.discharge_date, "YYYY-MM-DD")
              .format("MM/DD/YYYY")
          : "-",
    },
    {
      header: "Nonadmit",
      key: "nonadmit_date",
      sortable: true,
      render: (row) =>
        row.nonadmit_date
          ? moment
              .utc(row.nonadmit_date, "YYYY-MM-DD")
              .format("MM/DD/YYYY")
          : "-",
    },
  ]
};

export default referralsGridProps;
