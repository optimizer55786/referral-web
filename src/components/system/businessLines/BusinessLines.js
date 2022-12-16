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

import BusinessLineFormModal from "./BusinessLineFormModal";

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

const BusinessLines = () => {
  const [edit, setEdit] = useState(null); // null = hide; [id string] = edit existing; "new" = create new
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
        title="Business Lines"
        titleRight={
          <>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setEdit("new")}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Add Business
              Line
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
          cacheKey="account-business-lines"
          endpoint="/business-lines"
          columns={[
            {
              header: "Name",
              key: "business_line_name",
              sortable: true,
              render: (row) => {
                return (
                  <Button
                    variant="link"
                    className="m-0 p-0"
                    onClick={() => setEdit(row.business_line_id)}
                  >
                    {row.business_line_name}
                  </Button>
                );
              },
            },
            {
              header: "Key",
              key: "business_line_key",
              sortable: true,
            },
            {
              header: "Show In Reports",
              key: "business_line_show",
              sortable: true,
              render: (row) => {
                return row.business_line_show ? "Yes" : "No";
              },
            },
          ]}
          sortBy="business_line_name"
          sortDir="ASC"
          filters={filters}
          rowActions={[
            {
              label: "Edit",
              roles: [],
              onClick: (row) => setEdit(row.business_line_id),
            },
            {
              label: "Delete",
              roles: [],
              onClick: (row) => {
                confirmation({
                  asyncUrl: `/business-lines/${row.business_line_id}`,
                  asyncMethod: "delete",
                  question:
                    "Are you sure you want to delete the selected business line?",
                  onConfirm: () => {
                    toast.success(
                      "The selected business line was successfully removed."
                    );
                    queryClient.invalidateQueries("account-business-lines");
                  },
                });
              },
            },
          ]}
        />
      </ContentBlock>
      <BusinessLineFormModal
        show={edit !== null}
        toggle={() => setEdit(null)}
        businessLineId={edit}
        onSuccess={() => {
          toast.success("The business line was successfully saved.");
          queryClient.invalidateQueries("account-business-lines");
        }}
      />
    </MainLayout>
  );
};

export default BusinessLines;
