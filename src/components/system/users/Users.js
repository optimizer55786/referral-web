import React, { useState, useDispatch } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import MainLayout from "../../layout/MainLayout";
import AsyncTable from "../../common/AsyncTable";
import ContentBlock from "../../common/ContentBlock";
import { useFormData } from "../../../hooks/useFormData";

import UserFormModal from "./UserFormModal";

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

const Users = () => {
  const { formData, onChange } = useFormData(formDataDefaults);
  const [filters, setFilters] = useState({ ...getFilters(formData) });
  const [editUser, setEditUser] = useState(null); // null = hide; "id string" = edit existing; "new" = create new
  const history = useHistory();
  const queryClient = useQueryClient();
  const confirmation = useDispatch("confirmation");

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...getFilters(formData) });
  };

  return (
    <MainLayout>
      <ContentBlock
        title="Users"
        titleRight={
          <>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setEditUser("new")}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Add User
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
          cacheKey="account-users"
          endpoint="/users"
          columns={[
            {
              header: "Name",
              key: "name",
              sortable: true,
              render: (row) => {
                return (
                  <Link to={`/system/users/${row.user_id}`}>{row.name}</Link>
                );
              },
            },
            {
              header: "Email",
              key: "email",
              sortable: true,
            },
            {
              header: "Business Line",
              key: "business_line_name",
              sortable: true,
            },
            {
              header: "Organization",
              key: "org_name",
              sortable: true,
            },
            {
              header: "Role",
              key: "role_name",
              sortable: true,
            },
            {
              header: "Timezone",
              key: "timezone",
              sortable: true,
            },
            {
              header: "Status",
              key: "active",
              sortable: true,
              render: (row) => {
                return row.active ? "ACTIVE" : "INACTIVE";
              },
            },
          ]}
          checkboxKey="user_id"
          sortBy="name"
          sortDir="ASC"
          filters={filters}
          rowActions={[
            {
              label: "Profile",
              roles: [],
              onClick: (row) => history.push(`/community/users/${row.user_id}`),
            },
            {
              label: "Edit",
              roles: [],
              onClick: (row) => setEditUser(row.user_id),
            },
            {
              label: "Toggle Active Status",
              roles: [],
              onClick: (row) => {
                const opts = {
                  question: `Are you sure you want to set this user to ${
                    row.active ? "INACTIVE" : "ACTIVE"
                  }?`,
                  asyncUrl: `/users/${row.user_id}/toggle-status`,
                  onConfirm: (res) => {
                    toast.success(
                      `${row.name} as been successfully set to ${
                        row.active ? "INACTIVE" : "ACTIVE"
                      }.`
                    );
                    queryClient.invalidateQueries("account-users");
                  },
                };
                confirmation(opts);
              },
            },
          ]}
        />
      </ContentBlock>

      <UserFormModal
        show={editUser !== null}
        toggle={() => setEditUser(null)}
        userId={editUser}
        onSuccess={() => {
          toast.success("The user changes were successfully saved.");
          queryClient.invalidateQueries("account-users");
        }}
      />
    </MainLayout>
  );
};

export default Users;
