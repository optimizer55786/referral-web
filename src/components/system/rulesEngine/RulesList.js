import React, { useState, useDispatch } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";

import MainLayout from "../../layout/MainLayout";
import AsyncTable from "../../common/AsyncTable";
import ContentBlock from "../../common/ContentBlock";
import { useFormData } from "../../../hooks/useFormData";

const getFilters = (formData) => {
  const filters = {};

  ["search"].forEach((k) => {
    if (formData[k] !== "") {
      filters[k] = formData[k];
    }
  });

  return filters;
};

const formDataDefaults = {
  search: "",
};

const RulesList = () => {
  const { formData, onChange } = useFormData(formDataDefaults);
  const [filters, setFilters] = useState({ ...getFilters(formData) });
  const queryClient = useQueryClient();
  const confirmation = useDispatch("confirmation");
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...getFilters(formData) });
  };

  return (
    <MainLayout>
      <ContentBlock
        title="Rules"
        titleRight={
          <>
            <Link
              to={`/system/rules-engine/new`}
              className="btn btn-white btn-sm"
              style={{ marginLeft: "0.5rem" }}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Ruleset
            </Link>
          </>
        }
      >
        <form onSubmit={onSubmit} className="mb-3">
          <Row>
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={onChange}
                  placeholder="Search..."
                />
              </Form.Group>
            </Col>
          </Row>
        </form>

        <AsyncTable
          cacheKey="account-rulesets"
          endpoint="/rulesets"
          columns={[
            {
              header: "Name",
              key: "ruleset_title",
              sortable: true,
              render: (row) => {
                return (
                  <Link to={`/system/rules-engine/${row.ruleset_id}`}>
                    {row.ruleset_title}
                  </Link>
                );
              },
            },
            {
              header: "Event Type",
              key: "ruleset_event_type",
              sortable: true,
            },
            {
              header: "Tags",
              key: "ruleset_meta.tags",
              sortable: false,
            },
          ]}
          checkboxKey="ruleset_id"
          sortBy="ruleset_title"
          sortDir="ASC"
          filters={filters}
          rowActions={[
            {
              label: "Edit",
              roles: [],
              onClick: (row) =>
                history.push(`/system/rules-engine/${row.ruleset_id}`),
            },
            {
              label: "Test",
              roles: [],
              onClick: (row) => toast.info("TEST"),
            },
            {
              label: "Delete",
              roles: [],
              onClick: (row) => {
                confirmation({
                  asyncUrl: `/rulesets/${row.ruleset_id}`,
                  asyncMethod: "delete",
                  question:
                    "Are you sure you want to delete the selected ruleset?",
                  onConfirm: () => {
                    toast.success(
                      "The selected ruleset was successfully removed."
                    );
                    queryClient.invalidateQueries("account-rulesets");
                  },
                });
              },
            },
          ]}
        />
      </ContentBlock>
    </MainLayout>
  );
};

export default RulesList;
