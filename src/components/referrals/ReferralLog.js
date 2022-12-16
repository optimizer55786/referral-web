import React, { useGlobal, useState } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import AsyncTable from "../common/AsyncTable";
import OrgSelect from "../common/forms/OrgSelect";
import { useFormData } from "../../hooks/useFormData";

const ReferralLog = () => {
  const [user] = useGlobal("user");
  const { formData, onChange } = useFormData({ search: "", org: null });
  const [filters, setFilters] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();

    const newFilters = { search: formData.search };

    if (formData.org) {
      newFilters.org_id = formData.org.value;
    }

    setFilters(newFilters);
  };

  return (
    <MainLayout>
      <ContentBlock
        title="Referral Log"
        titleRight={
          <>
            <Button
              className="btn-white"
              size="sm"
              onClick={() => toast.info("TEST")}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> New Prospect
            </Button>
          </>
        }
        fullHeight={false}
      >
        <form onSubmit={onSubmit} className="mb-3">
          <Row>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                name="search"
                value={formData.search}
                onChange={onChange}
                placeholder="Search..."
              />
            </Col>
            {user.role_name !== "rep" ? (
              <Col xs={12} sm={6} md={2}>
                <Form.Label>Office/Branch</Form.Label>
                <OrgSelect
                  value={formData.org}
                  onChange={(val) =>
                    onChange({ target: { name: "org", value: val } })
                  }
                  scoped={true}
                  queryParams={{ locationsOnly: "1" }}
                />
              </Col>
            ) : null}
            <Col className="text-end">
              <div style={{ marginTop: "32px" }}>
                <Button type="submit" variant="primary">
                  Filter
                </Button>
              </div>
            </Col>
          </Row>
        </form>

        <AsyncTable
          cacheKey="referral-log"
          endpoint="/referral-log"
          checkboxKey="referral_log_id"
          filters={filters}
          editable={true}
          columns={[
            {
              header: "Patient",
              key: "patient_name",
            },
            {
              header: "Staff Member",
              key: "staff_member",
            },
            {
              header: "Status",
              key: "status",
            },
            {
              header: "Referral Date",
              key: "referral_date",
              render: (row) =>
                row.referral_date
                  ? moment.utc(row.referral_date).format("MM/DD/YYYY")
                  : "",
            },
            {
              header: "SOC Date",
              key: "start_of_care_date",
              render: (row) =>
                row.start_of_care_date
                  ? moment.utc(row.start_of_care_date).format("MM/DD/YYYY")
                  : "",
            },
            {
              header: "Nonadmit Date",
              key: "nonadmit_date",
              render: (row) =>
                row.nonadmit_date
                  ? moment.utc(row.nonadmit_date).format("MM/DD/YYYY")
                  : "",
            },
            {
              header: "Insurance",
              key: "insurance",
            },
            {
              header: "Insurance Type",
              key: "insurance_type",
            },
            {
              header: "Notes",
              key: "notes",
            },
          ]}
          rowActions={[
            {
              label: "Edit",
              onClick: (row) => toast.info("EDIT"),
            },
            {
              label: "Convert/Link To",
              onClick: (row) => toast.info("CONVERT"),
            },
            {
              label: "Delete",
              onClick: (row) => toast.warn("DELETE"),
            },
          ]}
        />
      </ContentBlock>
    </MainLayout>
  );
};

export default ReferralLog;
