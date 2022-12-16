import React, { useGlobal, useState } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import ActivityFeed from "../../activity/ActivityFeed";
import AddActivityModal from "./AddActivityModal";
import { useFormData } from "../../../hooks/useFormData";
import { useQueryClient } from "react-query";

const Activity = ({ refSource }) => {
  const [user] = useGlobal("user");
  const { formData, setData } = useFormData({ filter: "all", urlParams: {} });
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <Row>
        <Col xs={12} sm={6} md={4} className="mb-3">
          <Form.Group>
            <Form.Select
              name="filter"
              onChange={(e) => {
                const params = {};

                switch (e.target.value) {
                  case "refOnly":
                    params.no_children = true;
                    break;
                  case "my":
                    params.user_id = user.user_id;
                    break;
                  default:
                  // do nothing for all
                }

                setData({ filter: e.target.value, urlParams: params });
              }}
              value={formData.filter}
            >
              <option value="all">All Related Activity</option>
              <option value="refOnly">
                Activity For {refSource.referral_source_name} Only
              </option>
              <option value="my">My Activity Only</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col className="mb-3 text-end">
          <Button variant="light" onClick={() => setShowAddActivityModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Activity
          </Button>
        </Col>
      </Row>

      <div>
        {
          <ActivityFeed
            objectType="referral-source"
            objectId={refSource.referral_source_id}
            filters={formData.urlParams}
          />
        }
      </div>
      <AddActivityModal
        show={showAddActivityModal}
        toggle={() => setShowAddActivityModal(false)}
        referralSource={refSource}
        onSuccess = {()=> queryClient.invalidateQueries()}
      />
    </>
  );
};

Activity.propTypes = {
  refSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
    _assigned_users: PropTypes.array.isRequired,
  }).isRequired,
};

export default Activity;
