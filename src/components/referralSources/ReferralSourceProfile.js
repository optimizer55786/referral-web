import React, { useGlobal, useState, useEffect } from "reactn";
import { Link, useParams, useHistory } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { LineChart } from "react-chartkick";
import { toast } from "react-toastify";
import styled from "styled-components";
import moment from "moment-timezone";
import { useQueryClient } from "react-query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/pro-solid-svg-icons";

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import Tabs from "../common/Tabs";
import Loading from "../common/Loading";
import AssignedLabel from "../common/labels/AssignedLabel";
import MarkdownLabel from "../common/labels/MarkdownLabel";
import { useApiGet, makeRequest } from "../../hooks/useApi";

import Info from "./profile/Info";
import Meta from "./profile/Meta";
import Activity from "./profile/Activity";
import Locations from "./profile/Locations";
import Affiliations from "./profile/Affiliations";
import Referrals from "./profile/Referrals";
import Tactics from "./profile/Tactics";
import ScheduleModal from "../common/ScheduleModal";
import RulesEngineDetails from "./profile/RulesEngineDetails";

const FormText = styled.p`
  margin-bottom: 0;
`;

const ScheduleRule = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  svg {
    float: right;
  }
`;

const referralTrendData = [
  {
    name: "Referral Source",
    data: {
      August: 36,
      September: 29,
      October: 22,
      November: 24.75,
      December: 29,
      January: 36,
    },
  },
  {
    name: "Referring Physician",
    data: {
      August: 26,
      September: 19,
      October: 12,
      November: 14.75,
      December: 19,
      January: 26,
    },
  },
  {
    name: "Primary Physician",
    data: {
      August: 38,
      September: 22,
      October: 8,
      November: 6,
      December: 9,
      January: 3,
    },
  },
];

const ReferralSourceProfile = () => {
  const { referralSourceId } = useParams();
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const [user] = useGlobal("user");
  const [referralsFilters, setReferralFilters] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(null);
  const [rulesEngineData, setRulesEngineData] = useState([]);
  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, data: refSource } = useApiGet(
    `ref-source-${referralSourceId}`,
    `/referral-sources/${referralSourceId}`,
    { businessLine: selectedBusinessLineId, expand: 1 },
    {
      staleTime: 1000,
      onError: (err) => toast.error(err.message),
    }
  );

  useEffect(() => {
    if (!refSource) {
      return;
    }

    const callRulesEngine = async () => {
      const results = await makeRequest("post", "/rules-engine", {
        eventType: "referral_source::get",
        eventData: { ...refSource },
      });
      setRulesEngineData(results);
    };
    callRulesEngine();
  }, [refSource]);

  const isEditableSchedule = (schedule) => {
    const availableRoles = ["sysadmin", "admin", "manager"];
    return (
      schedule.user_id === user.user_id ||
      availableRoles.includes(user.role_name)
    );
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading msg="Loading referral source profile..." />
      ) : (
        <Row>
          <Col xs={12} sm={8}>
            <ContentBlock fullHeight={false} className="mb-3">
              <Info refSource={refSource} />
            </ContentBlock>

            <ContentBlock fullHeight={false} className="mb-3">
              <Row>
                <Col xs={6} sm={2}>
                  <Form.Group>
                    <Form.Label>NPI</Form.Label>
                    <FormText>{refSource.referral_source_npi}</FormText>
                  </Form.Group>
                </Col>
                <Col xs={6} sm={2}>
                  <Form.Group>
                    <Form.Label>Taxonomy</Form.Label>
                    <FormText>Unknown</FormText>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Assigned To</Form.Label>
                    <AssignedLabel users={refSource._assigned_users} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Primary Affiliation</Form.Label>
                    <br />
                    {refSource.referral_source_parent_id ? (
                      <Link
                        to={`/referral-sources/${refSource.referral_source_parent_id}`}
                      >
                        {refSource.referral_source_parent_name}
                      </Link>
                    ) : (
                      <FormText>None</FormText>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </ContentBlock>

            <Meta refSource={refSource} />

            <ContentBlock fullHeight={false} className="mb-3">
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <br />
                {refSource.referral_source_notes ? (
                  <MarkdownLabel content={refSource.referral_source_notes} />
                ) : (
                  <p className="mb-0">Add notes...</p>
                )}
              </Form.Group>
            </ContentBlock>

            {rulesEngineData ? (
              <RulesEngineDetails
                refSource={refSource}
                rulesEngineEvents={rulesEngineData}
              />
            ) : null}

            <Tabs
              tabs={[
                {
                  label: "Activity Feed",
                  content: <Activity refSource={refSource} />,
                },
                {
                  label: "Locations",
                  content: <Locations refSource={refSource} />,
                },
                {
                  label: "Referral Source Tree",
                  content: <Affiliations refSource={refSource} />,
                },
                {
                  label: "Referrals",
                  content: (
                    <Referrals
                      refSource={refSource}
                      defaultFilters={referralsFilters}
                    />
                  ),
                },
                {
                  label: "Tactics",
                  content: <Tactics refSource={refSource} />,
                },
                {
                  label: "System",
                  content: <p>[SYSTEM DATA]</p>,
                },
              ]}
              style={{ minHeight: 450 }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <ContentBlock
              title="Referral Trend"
              fullHeight={false}
              className="mb-3"
            >
              <LineChart
                data={refSource._chartData.referralTrend.map((set) => {
                  const format = {};
                  Object.keys(set.data).forEach((dt) => {
                    const fm = moment.utc(dt, "YYYY-MM").format("MMMM");
                    format[fm] = set.data[dt];
                  });
                  return { name: set.name, data: format };
                })}
                legend="bottom"
                height={150}
                library={{
                  onClick: (e, el) => {
                    if (el.length === 0) {
                      return;
                    }

                    const dataSet = referralTrendData[el[0].datasetIndex];
                    const index = el[0].element.$context.dataIndex;

                    // we need to convert the month name clicked to an actual
                    // date that we can use to filter referral lists - so since
                    // we know that the chart is the last 6 months, we can use
                    // the dataIndex from the clicked element to go back
                    const mos = 6 - (index + 1);
                    const dt = moment
                      .utc()
                      .subtract(mos, "months")
                      .startOf("month");

                    setReferralFilters({
                      type: dataSet.name,
                      start: dt.format("YYYY-MM-DD"),
                      end: dt.endOf("month").format("YYYY-MM-DD"),
                    });
                    history.push(
                      `/referral-sources/${referralSourceId}#referrals`
                    );
                  },
                }}
              />
            </ContentBlock>
            <ContentBlock
              title="Conversion Ratio Trend"
              fullHeight={false}
              className="mb-3"
            >
              <LineChart
                data={[
                  {
                    name: "Referral Source",
                    data: {
                      August: 53,
                      September: 56,
                      October: 58,
                      November: 61.5,
                      December: 57,
                      January: 54,
                    },
                  },
                  {
                    name: "Referring Physician",
                    data: {
                      August: 61,
                      September: 64,
                      October: 66,
                      November: 63,
                      December: 60,
                      January: 64,
                    },
                  },
                  {
                    name: "Primary Physician",
                    data: {
                      August: 79,
                      September: 74,
                      October: 71,
                      November: 68,
                      December: 73,
                      January: 73,
                    },
                  },
                ]}
                legend="bottom"
                height={150}
              />
            </ContentBlock>
            <ContentBlock
              title="Top Nonadmit Reasons"
              fullHeight={false}
              className="mb-3"
            >
              <table className="w-100">
                <thead></thead>
                <tbody>
                  {refSource._chartData.topNonadmitReasons.map((row, i) => {
                    return (
                      <tr key={i} style={i < 3 ? { fontWeight: 700 } : {}}>
                        <td width="80%">
                          {i + 1}. {row.nonadmit_reason}
                        </td>
                        <td width="20%" className="text-end">
                          {row.total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ContentBlock>

            <ContentBlock title="Schedules" fullHeight={false} className="mb-3">
              {refSource._schedules.length === 0 ? (
                <p className="mb-0">
                  No users are currently scheduled for this referral source.
                </p>
              ) : (
                refSource._schedules.map((schedule, key) => {
                  let assignment = refSource._assigned_users
                    .filter((user) => user.user_id === schedule.user_id)
                    .shift();

                  return (
                    <div key={key}>
                      <Link
                        className="mb-0 fw-bold"
                        to={`/users/profile/${schedule.user_id}`}
                      >
                        {schedule.user_name}&nbsp;(
                        {assignment === undefined
                          ? "Unassigned"
                          : assignment.business_line_key}
                        )
                      </Link>
                      <br />
                      {isEditableSchedule(schedule) === true ? (
                        <ScheduleRule
                          className="fw-light text-capitalize"
                          onClick={() =>
                            setShowScheduleModal(schedule.schedule_id)
                          }
                        >
                          {schedule._schedule_text} &bull; Next On{" "}
                          {moment.utc(schedule._next_date).format("MM/DD/YYYY")}
                          <FontAwesomeIcon icon={faEdit} />
                        </ScheduleRule>
                      ) : (
                        <span className="fw-light text-capitalize">
                          {schedule._schedule_text} &bull; Next On{" "}
                          {moment.utc(schedule._next_date).format("MM/DD/YYYY")}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </ContentBlock>
          </Col>
        </Row>
      )}

      <ScheduleModal
        show={showScheduleModal !== null}
        toggle={() => setShowScheduleModal(null)}
        referralSource={refSource}
        scheduleId={showScheduleModal}
        onSuccess={() => queryClient.invalidateQueries()}
      />
    </MainLayout>
  );
};

export default ReferralSourceProfile;
