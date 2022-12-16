import React, { useGlobal, useState } from "reactn";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import styled from "styled-components";
import moment from "moment-timezone";

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import Loading from "../common/Loading";
import AsyncTable from "../common/AsyncTable";
import { useApiGet } from "../../hooks/useApi";
import { capitalizeWords } from "../../lib/stringHelpers";

import Info from "./profile/Info";
import { useEffect } from "react";

const FormText = styled.p`
  margin-bottom: 0;
`;

const StyledBadge = styled(Badge)`
  padding: 0.75rem;
  font-size: 1.15rem;
`;

const ReferralProfile = () => {
  const { referralId } = useParams();
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");

  const { isLoading, data: referral } = useApiGet(
    `ref-profile-${referralId}`,
    `/referrals/${referralId}`,
    { businessLine: selectedBusinessLineId, expand: 1 },
    {
      staleTime: 1000,
      onError: (err) => toast.error(err.message),
    }
  );

  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (referral) {
      setFilters({
        patientId: referral.patient_id,
        referralSourceId: referral.referral_source_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referral]);

  const statusBg = {
    pending: "primary",
    admit: "success",
    discharge: "warning",
    nonadmit: "danger",
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading msg="Loading referral profile..." />
      ) : (
        <Row>
          <Col xs={12}>
            <ContentBlock fullHeight={false} className="mb-3">
              <Info referral={referral} />
            </ContentBlock>
            <ContentBlock fullHeight={false} className="mb-3">
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <FormText>
                      <StyledBadge
                        bg={statusBg[referral.referral_status]}
                        className="text-capitalize"
                      >
                        {referral.referral_status}
                      </StyledBadge>
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Referral Date</Form.Label>
                    <FormText>
                      {referral.referral_date
                        ? moment
                            .utc(referral.referral_date)
                            .format("MM/DD/YYYY")
                        : "-"}
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Start of Care Date</Form.Label>
                    <FormText>
                      {referral.start_of_care_date
                        ? moment
                            .utc(referral.start_of_care_date)
                            .format("MM/DD/YYYY")
                        : "-"}
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Discharge Date</Form.Label>
                    <FormText>
                      {referral.discharge_date
                        ? moment
                            .utc(referral.discharge_date)
                            .format("MM/DD/YYYY")
                        : "-"}
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nonadmit Date</Form.Label>
                    <FormText>
                      {referral.nonadmit_date
                        ? moment
                            .utc(referral.nonadmit_date)
                            .format("MM/DD/YYYY")
                        : "-"}
                    </FormText>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Organization/Branch</Form.Label>
                    <FormText>{referral.org_name ?? "-"}</FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>User</Form.Label>
                    <FormText>
                      <Link to={`/system/users/${referral.user_id}`}>
                        {referral.user_name}
                      </Link>
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Referral Source</Form.Label>
                    <FormText>
                      <Link
                        to={`/referral-sources/${referral.referral_source_id}`}
                      >
                        {referral.referral_source_name}
                      </Link>
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Referring Physician</Form.Label>
                    <FormText>
                      {referral.referral_physician_name ?? "-"}
                    </FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Primary Physician</Form.Label>
                    <FormText>
                      {referral.primary_physician_name ?? "-"}
                    </FormText>
                  </Form.Group>
                </Col>
              </Row>
            </ContentBlock>
            <ContentBlock fullHeight={false} className="mb-3">
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Insurance Type</Form.Label>
                    <FormText>{referral.insurance_type ?? "-"}</FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Insurance Plan</Form.Label>
                    <FormText>{referral.insurance_plan ?? "-"}</FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nonadmit Reason</Form.Label>
                    <FormText>{referral.nonadmit_reason ?? "-"}</FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Discharge Reason</Form.Label>
                    <FormText>{referral.discharge_reason ?? "-"}</FormText>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Patient Notes</Form.Label>
                    <FormText>{referral.patient_notes ?? "-"}</FormText>
                  </Form.Group>
                </Col>
              </Row>
            </ContentBlock>
            <ContentBlock className="mb-3" fullHeight={false}>
              <AsyncTable
                cacheKey={`referrals-${referral.patient_id}`}
                endpoint="/referrals"
                filters={filters}
                sortBy="referral_date"
                sortDir="DESC"
                columns={[
                  {
                    header: "User",
                    key: "user_name",
                    sortable: true,
                    render: (row) => (
                      <Link to={`/system/users/${row.user_id}`}>
                        {row.user_name}
                      </Link>
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
                ]}
              />
            </ContentBlock>
          </Col>
        </Row>
      )}
    </MainLayout>
  );
};

export default ReferralProfile;
