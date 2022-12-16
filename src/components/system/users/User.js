import React, { useState } from "reactn";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCog, faPen } from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";
import styled from "styled-components";

import MainLayout from "../../layout/MainLayout";
import ContentBlock from "../../common/ContentBlock";
import Loading from "../../common/Loading";
import CustomDropdown from "../../common/CustomDropdown";
import Tabs from "../../common/Tabs";
import { useApiGet } from "../../../hooks/useApi";
import { capitalizeWords } from "../../../lib/stringHelpers";

import UserFormModal from "./UserFormModal";

const StyledLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
`;

const Small = styled.small`
  font-size: 1.15rem;
  margin-left: 1rem;
`;

const User = () => {
  const { userId } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, data } = useApiGet(
    `user-${userId}`,
    `/users/${userId}`,
    null,
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );

  return (
    <MainLayout>
      {isLoading ? (
        <Loading msg="Loading user detail..." />
      ) : (
        <>
          <ContentBlock fullHeight={false} className="mb-3">
            <StyledLink to="/system/users">
              <FontAwesomeIcon icon={faChevronLeft} /> Back to Users
            </StyledLink>
            <div className="float-end">
              <CustomDropdown
                label={
                  <>
                    <FontAwesomeIcon icon={faCog} /> Actions
                  </>
                }
                menuItems={[
                  {
                    label: "Edit",
                    icon: faPen,
                    onClick: () => setShowEdit(true),
                  },
                ]}
              ></CustomDropdown>
            </div>
            <h3>
              {data.name} {<Small>{capitalizeWords(data.role_name)}</Small>}
            </h3>
          </ContentBlock>

          <ContentBlock fullHeight={false} className="mb-3">
            <Row>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Business Line</Form.Label>
                  <p className="mb-0">{data.business_line_name || "-"}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Organization</Form.Label>
                  <p className="mb-0">{data.org_name || "-"}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <p className="mb-0">{capitalizeWords(data.role_name)}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Timezone</Form.Label>
                  <p className="mb-0">{data.timezone}</p>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <p className="mb-0">{data.first_name}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <p className="mb-0">{data.last_name}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <p className="mb-0">{data.email}</p>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <p className="mb-0">{data.mobile || "-"}</p>
                </Form.Group>
              </Col>
            </Row>
          </ContentBlock>

          <Tabs
            tabs={[
              {
                label: "Activity",
                content: <p>Review the user's most recent activity.</p>,
              },
              {
                label: "Goals",
                content: (
                  <p>
                    User goals and details around their success, failure and
                    trends.
                  </p>
                ),
              },
              {
                label: "Insights",
                content: (
                  <p>
                    Get insight into potential issues such as tagged referral
                    sources that are not scheduled.
                  </p>
                ),
              },
              {
                label: "Audit Log",
                content: (
                  <p>Review the events triggered/created by this user.</p>
                ),
              },
            ]}
          />
        </>
      )}

      <UserFormModal
        show={showEdit}
        toggle={() => setShowEdit(false)}
        userId={userId}
        values={data || {}}
        onSuccess={() => {
          toast.success("The user changes were successfully saved.");
          queryClient.invalidateQueries(`user-${userId}`);
        }}
      />
    </MainLayout>
  );
};

export default User;
