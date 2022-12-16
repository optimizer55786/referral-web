import React from "reactn";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faFlame } from "@fortawesome/pro-solid-svg-icons";
import { useApiGet } from "../../hooks/useApi";
import { toast } from "react-toastify";

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import InfoCard from "../common/InfoCard";
import SmallCard from "../common/SmallCard";
import Loading from "../common/Loading";

import ReferralsMtdWidget from "./widgets/ReferralsMtdWidget";
import ConversionRatioMtdWidget from "./widgets/ConversionRatioMtdWidget";
import AvgLengthOfStayWidget from "./widgets/AvgLengthOfStayWidget";
import TopNonadmitReasonsWidget from "./widgets/TopNonadmitReasonsWidget";
import DetailsByLocationWidget from "./widgets/DetailsByLocationWidget";

const Dashboard = () => {
  const { isLoading, data } = useApiGet(
    `dashboard`,
    `/dashboard`,
    {},
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );
  const filterLocationDataTo = (id) => {
    // setLocations(locationData.filter((l) => l.id === id));
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading msg="Loading dashboard..." />
      ) : (
        <>
          <Row>
            <Col xs={12} sm={4} className="mb-3">
              <ReferralsMtdWidget data={data} />
            </Col>
            <Col xs={12} sm={4} className="mb-3">
              <ConversionRatioMtdWidget data={data} />
            </Col>
            <Col xs={12} sm={4} className="mb-3">
              <AvgLengthOfStayWidget data={data} />
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={4} className="mb-3">
              <ContentBlock
                title={
                  <>
                    <FontAwesomeIcon icon={faFlame} fixedWidth={true} /> AI
                    Insights
                  </>
                }
                className="mb-3"
              >
                <SmallCard
                  actions={[
                    {
                      label: "See More",
                      onClick: () => alert("See More"),
                    },
                    {
                      label: "Dismiss",
                      onClick: () => alert("Dismiss"),
                    },
                  ]}
                >
                  <Link to={``}>Sample Health System (AA Rating)</Link> has sent
                  you a referral for the first time.
                </SmallCard>
                <SmallCard
                  actions={[
                    {
                      label: "See More",
                      onClick: () => filterLocationDataTo(2),
                    },
                    {
                      label: "Dismiss",
                      onClick: () => alert("Dismiss"),
                    },
                  ]}
                >
                  <Link to={``}>Another Location</Link> lost market share
                  (-8.5%) in Q1 2021.
                </SmallCard>
              </ContentBlock>
            </Col>
            <Col xs={12} sm={4} className="mb-3">
              <ContentBlock
                title={
                  <>
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      fixedWidth={true}
                    />{" "}
                    Alerts
                  </>
                }
              >
                {data.alerts.map((alert, key) => (
                  <InfoCard key={key} info={alert} />
                ))}
                <SmallCard onClick={() => filterLocationDataTo(2)}>
                  <Link to={`/locations/2`}>Another Location</Link> is currently
                  under performing with their{" "}
                  <strong className="text-danger">
                    conversion ratio (41%)
                  </strong>{" "}
                  appearing to be the key metric blocking growth.
                </SmallCard>
              </ContentBlock>
            </Col>
            <Col xs={12} sm={4} className="mb-3">
              <TopNonadmitReasonsWidget data={data} />
            </Col>
          </Row>

          <Row>
            <Col>
              <DetailsByLocationWidget data={data} />
            </Col>
          </Row>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
