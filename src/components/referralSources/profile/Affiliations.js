import React, { useState } from "reactn";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Form } from "react-bootstrap";

import AsyncTable from "../../common/AsyncTable";
import { useFormData } from "../../../hooks/useFormData";
import { capitalizeWords } from "../../../lib/stringHelpers";

const getFilters = (data) => {
  const filters = {};

  if (data.filter !== "all") {
    filters.referral_source_type = data.filter;
  }

  if (data.search) {
    filters.search = data.search;
  }

  return filters;
};

const Affiliations = ({ refSource }) => {
  const { formData, onChange } = useFormData({ search: "", filter: "all" });
  const [filters, setFilters] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters(getFilters(formData));
  };

  return (
    <>
      <form onSubmit={onSubmit} className="mb-3">
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Form.Control
              type="search"
              name="search"
              value={formData.search}
              onChange={onChange}
              placeholder="Search..."
            />
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-3">
            <Form.Select
              name="filter"
              onChange={(e) => {
                const changes = { ...formData, filter: e.target.value };
                onChange(e);
                setFilters(getFilters(changes));
              }}
              value={formData.filter}
            >
              <option value="all">All Associations</option>
              <option value="facility">Facilities Only</option>
              <option value="provider">Providers Only</option>
              <option value="contact">Contacts Only</option>
            </Form.Select>
          </Col>
        </Row>
      </form>

      <AsyncTable
        cacheKey={`tree-${refSource.referral_source_id}`}
        endpoint={`/referral-sources/tree/${refSource.referral_source_id}`}
        sortBy="referral_source_name"
        sortDir="ASC"
        filters={filters}
        columns={[
          {
            header: "Name",
            key: "referral_source_name",
            sortable: true,
            render: (row) => {
              return (
                <Link to={`/referral-sources/${row.referral_source_id}`}>
                  {row.referral_source_name}
                </Link>
              );
            },
          },
          {
            header: "Type",
            key: "referral_source_type",
            sortable: true,
            render: (row) => {
              return capitalizeWords(row.referral_source_type);
            },
          },
          {
            header: "Primary Affiliation",
            key: "referral_source_parent_name",
            sortable: true,
            render: (row) => {
              if (!row.referral_source_parent_id) {
                return "-";
              }
              return (
                <Link to={`/referral-sources/${row.referral_source_parent_id}`}>
                  {row.referral_source_parent_name}
                </Link>
              );
            },
          },
        ]}
        rowActions={[
          {
            label: "Delete Affiliation",
            onClick: () => toast.info("DELETE"),
          },
        ]}
      />
    </>
  );
};

export default Affiliations;
