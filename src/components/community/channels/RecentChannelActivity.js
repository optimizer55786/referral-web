import React from "reactn";
import { Link } from "react-router-dom";
import { Row, Col, Image } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

import Loading from "../../common/Loading";
import MarkdownLabel from "../../common/labels/MarkdownLabel";
import { useApiGet } from "../../../hooks/useApi";

const RecentChannelActivity = () => {
  const { isLoading, isFetching, data } = useApiGet(
    "recent-posts",
    "/community/channels/recent-posts",
    null,
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );
  const today = moment();

  if (isLoading || isFetching) {
    return <Loading msg="Loading recent activity..." />;
  }

  return (
    <>
      {data.rows.map((post, i) => {
        const dt = moment(post.post_date);

        return (
          <div
            key={i}
            className="mb-3 pb-3"
            style={{ borderBottom: "1px solid #d8e2ef" }}
          >
            <Row>
              <Col xs={3} sm={2} md={1}>
                <Image
                  src={
                    post.avatar ||
                    "https://public-referral-lab.s3.us-east-2.amazonaws.com/user_empty_avatar.png"
                  }
                  title={post.user_name}
                  alt={post.user_name}
                  roundedCircle
                  fluid
                  className="border"
                />
              </Col>
              <Col>
                <strong className="text-muted">
                  <Link to={`/community/people/${post.user_id}`}>
                    {post.user_name}
                  </Link>{" "}
                  posted in{" "}
                  <Link to={`/community/channels/${post.channel_name}`}>
                    #{post.channel_name}
                  </Link>{" "}
                  {dt.isSame(today, "day") ? "today" : dt.format("M/D/YYYY")} @{" "}
                  {dt.format("h:mm A")}
                </strong>
                <br />
                <MarkdownLabel content={post.post_details} />
              </Col>
            </Row>
          </div>
        );
      })}
    </>
  );
};

export default RecentChannelActivity;
