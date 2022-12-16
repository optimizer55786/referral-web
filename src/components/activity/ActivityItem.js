import React, { useGlobal } from "reactn";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import moment from "moment-timezone";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-solid-svg-icons";

import CustomDropdown from "../common/CustomDropdown";
import MarkdownLabel from "../common/labels/MarkdownLabel";
import { capitalizeWords } from "../../lib/stringHelpers";
import { Link } from "react-router-dom";

const ItemWrapper = styled.div`
  border-left: 3px solid #ccc;
  background: rgba(0, 0, 0, 0.03);
  padding: 0.5rem;
`;

const ActivityItem = ({ activity, matchId = null }) => {
  const [user] = useGlobal("user");
  const dt = moment.utc(activity.activity_date);

  return (
    <ItemWrapper className="mb-3">
      <div className="float-end">
        <p className="mb-0">{capitalizeWords(dt.fromNow())}</p>
      </div>
      <h5>
        {capitalizeWords(activity.activity_type)} with{" "}
        {matchId && matchId !== activity.referral_source_id ? (
          <Link to={`/referral-sources/${activity.referral_source_id}`}>
            {activity.referral_source_name}
          </Link>
        ) : (
          activity.referral_source_name
        )}
      </h5>
      <div>
        <MarkdownLabel content={activity.activity_details} />
      </div>
      <hr />
      <Row>
        <Col>
          {user.user_id !== activity.user_id ? (
            <Link to={`/users/profile/${activity.user_id}`}>
              {activity.user_name}
            </Link>
          ) : (
            activity.user_name
          )}{" "}
          on {dt.format("MM/DD/YYYY")} at {dt.format("h:mm A")}
        </Col>
        <Col className="text-end">
          {activity.user_id === user.user_id ? (
            <CustomDropdown
              menuItems={[
                {
                  label: "Edit",
                  onClick: () => toast.info("EDIT"),
                },
                {
                  label: "Delete",
                  onClick: () => toast.info("DELETe"),
                },
              ]}
              label={<FontAwesomeIcon icon={faCog} />}
            />
          ) : null}
        </Col>
      </Row>
    </ItemWrapper>
  );
};

ActivityItem.propTypes = {
  activity: PropTypes.shape({
    activity_id: PropTypes.string.isRequired,
    activity_date: PropTypes.string.isRequired,
    activity_type: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ActivityItem;
