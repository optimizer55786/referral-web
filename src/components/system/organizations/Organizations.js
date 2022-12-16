import React, { useState, useDispatch } from "reactn";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";

import MainLayout from "../../layout/MainLayout";
import AsyncTable from "../../common/AsyncTable";
import ContentBlock from "../../common/ContentBlock";
import { useFormData } from "../../../hooks/useFormData";

import OrganizationFormModal from "./OrganizationFormModal";

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

const Organizations = () => {
  const [edit, setEdit] = useState(null);
  const { formData, onChange } = useFormData(formDataDefaults);
  const [filters, setFilters] = useState({ ...getFilters(formData) });
  const queryClient = useQueryClient();
  const confirmation = useDispatch("confirmation");

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...getFilters(formData) });
  };

  return (
    <MainLayout>
      <ContentBlock
        title="Organizations"
        titleRight={
          <>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setEdit("new")}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Add
              Organization
            </Button>
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
          cacheKey="account-orgs"
          endpoint="/organizations"
          columns={[
            {
              header: "Name",
              key: "org_name",
              sortable: true,
              render: (row) => {
                return (
                  <Button
                    variant="link"
                    className="m-0 p-0"
                    onClick={() => setEdit(row.org_id)}
                  >
                    {row.org_name}
                  </Button>
                );
              },
            },
            {
              header: "Type",
              key: "org_type",
              sortable: true,
            },
            {
              header: "Business Line",
              key: "business_line_name",
              sortable: true,
            },
            {
              header: "Parent",
              key: "parent_org_name",
              sortable: true,
              render: (row) => {
                return row.parent_org_id ? (
                  <Link to={`/system/organizations/${row.parent_org_id}`}>
                    {row.parent_org_name}
                  </Link>
                ) : (
                  "-"
                );
              },
            },
          ]}
          checkboxKey="org_id"
          sortBy="org_name"
          sortDir="ASC"
          filters={filters}
          rowActions={[
            {
              label: "Edit",
              roles: [],
              onClick: (row) => setEdit(row.org_id),
            },
            {
              label: "Delete",
              roles: [],
              onClick: (row) => {
                confirmation({
                  asyncUrl: `/organizations/${row.org_id}`,
                  asyncMethod: "delete",
                  question:
                    "Are you sure you want to delete the selected organization?",
                  onConfirm: () => {
                    toast.success(
                      "The selected organization was successfully removed."
                    );
                    queryClient.invalidateQueries("account-orgs");
                  },
                });
              },
            },
          ]}
        />
      </ContentBlock>
      <OrganizationFormModal
        show={edit !== null}
        toggle={() => setEdit(null)}
        orgId={edit}
        onSuccess={() => {
          toast.success("The organization changes were successfully saved.");
          queryClient.invalidateQueries("account-orgs");
        }}
      />
    </MainLayout>
  );
};

export default Organizations;
