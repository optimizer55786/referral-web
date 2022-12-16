import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment-timezone";

import AsyncTable from "../../common/AsyncTable";
import { useFormData } from "../../../hooks/useFormData";
import { Link } from "react-router-dom";

const defaultVals = {
  type: "All",
  start: moment.utc().startOf("month").format("YYYY-MM-DD"),
  end: moment.utc().format("YYYY-MM-DD"),
};

const Referrals = ({ refSource, defaultFilters = {} }) => {
  const { formData, onChange, setData } = useFormData({
    ...defaultVals,
    ...defaultFilters,
  });
  const [filters, setFilters] = useState({
    ...formData,
    referralSourceId: refSource.referral_source_id,
  });

  useEffect(() => {
    setData(defaultFilters, true);
    setFilters({
      ...defaultFilters,
      referralSourceId: refSource.referral_source_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilters]);

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({
      ...defaultFilters,
      referralSourceId: refSource.referral_source_id,
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="mb-3">
        <Row>
          <Col xs={12} sm={6} md={3}>
            <Form.Label>As</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={onChange}>
              {[
                "All",
                "Referral Source",
                "Referring Physician",
                "Primary Physician",
              ].map((v, i) => {
                return (
                  <option key={i} value={v}>
                    {v}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="start"
              onChange={onChange}
              value={formData.start}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end"
              onChange={onChange}
              value={formData.end}
            />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <div className="text-end" style={{ marginTop: "32px" }}>
              <Button
                variant="light"
                onClick={() => setData(defaultVals)}
                className="me-2"
              >
                Reset
              </Button>
              <Button type="submit" variant="primary">
                Filter
              </Button>
            </div>
          </Col>
        </Row>
      </form>

      <AsyncTable
        cacheKey={`referrals-${refSource.referral_source_id}`}
        endpoint="/referrals"
        filters={filters}
        sortBy="referral_date"
        sortDir="DESC"
        columns={[
          {
            header: "Patient",
            key: "patient_id",
            sortable: true,
            render: (row) => (
              <Link to={`/referrals/${row.patient_id}`}>
                {row.patient_name}
              </Link>
            ),
          },
          {
            header: "As",
            key: "_as",
            render: (row) => {
              if (row.referral_source_id === refSource.referral_source_id) {
                return "Referral Source";
              } else if (
                row.referral_physician_id === refSource.referral_source_id
              ) {
                return "Referring Physician";
              } else {
                return "Primary Physician";
              }
            },
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
            header: "Status",
            key: "status",
            sortable: true,
          },
          {
            header: "Referral Date",
            key: "referral_date",
            sortable: true,
            render: (row) =>
              row.referral_date
                ? moment.utc(row.referral_date).format("MM/DD/YYYY")
                : "-",
          },
          {
            header: "Start of Care Date",
            key: "start_of_care_date",
            sortable: true,
            render: (row) =>
              row.start_of_care_date
                ? moment.utc(row.start_of_care_date).format("MM/DD/YYYY")
                : "-",
          },
          {
            header: "Discharge Date",
            key: "discharge_date",
            sortable: true,
            render: (row) =>
              row.discharge_date
                ? moment.utc(row.discharge_date).format("MM/DD/YYYY")
                : "-",
          },
          {
            header: "Nonadmit Date",
            key: "nonadmit_date",
            sortable: true,
            render: (row) =>
              row.nonadmit_date
                ? moment.utc(row.nonadmit_date).format("MM/DD/YYYY")
                : "-",
          },
        ]}
      />
    </>
  );
};

Referrals.propTypes = {
  refSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Referrals;
