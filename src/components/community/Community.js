import React from "reactn";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { faCrown, faStar, faTrophy } from "@fortawesome/pro-solid-svg-icons";

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import SmallCard from "../common/SmallCard";

import RecentChannelActivity from "./channels/RecentChannelActivity";
import PopularDocuments from "./documents/PopularDocuments";
import RecentNews from "./news/RecentNews";

const Community = () => {
  return (
    <MainLayout>
      <Row>
        <Col xs={12} sm={8}>
          <ContentBlock
            title="Latest Activity in Channels"
            titleRight={<Link to="/community/channels">View All Channels</Link>}
            className="mb-3"
            fullHeight={false}
          >
            <RecentChannelActivity />
          </ContentBlock>

          <ContentBlock
            title="Popular Documents"
            titleRight={
              <Link to="/community/documents">View All Documents</Link>
            }
            className="mb-3"
            fullHeight={false}
          >
            <PopularDocuments />
          </ContentBlock>
        </Col>

        <Col xs={12} sm={4}>
          <RecentNews />
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Community;
