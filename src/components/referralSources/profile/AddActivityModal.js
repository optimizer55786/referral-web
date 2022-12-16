import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";

import ReferralSourceSelect from "../../common/forms/ReferralSourceSelect";
import MentionsField from "../../common/MentionsField";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPost } from "../../../hooks/useApi";

const AddActivityModal = ({ show, toggle, referralSource, onSuccess }) => {
  const dt = moment();
  const defaultValues = {
    referral_source: referralSource
      ? {
          value: referralSource.referral_source_id,
          label: referralSource.referral_source_name,
          record: referralSource,
        }
      : null,
    activity_date: dt.format("YYYY-MM-DD"),
    activity_time: dt.format("HH:mm"),
    activity_type: "call",
    activity_details: "",
  };
  const { formData, onChange, setData } = useFormData(defaultValues);
  const [mentionedUserList, setMentionedUserList] = useState([]);

  const api = useApiPost(
    "/activity",
    (resp) => {
      setData(defaultValues);
      toggle();
      toast.success("Activity added successfully!");
      onSuccess(resp);
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      referral_source_id: formData.referral_source.value,
      activity_date: moment(
        `${formData.activity_date} ${formData.activity_time}`,
        "YYYY-MM-DD HH:mm"
      ).toDate(),
      activity_type: formData.activity_type,
      activity_details: formData.activity_details,
      activity_mentions: mentionedUserList,
    };

    api.mutate(payload);
  };
  const handleUserMention = (value) => {
    setMentionedUserList((oldList) => [...oldList, value]);
  };

  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Add Activity</Modal.Title>
      </Modal.Header>

      <form onSubmit={onSubmit} id="new-activity-form">
        <Modal.Body>
          <Form.Group>
            <Form.Label className="required">Referral Source</Form.Label>
            <ReferralSourceSelect
              value={formData.referral_source}
              onChange={onChange}
            />
          </Form.Group>
          <br />
          <Row>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="required">Activity Date</Form.Label>
                <Form.Control
                  type="date"
                  name="activity_date"
                  placeholder="Activity Date"
                  value={formData.activity_date}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="required">Activity Time</Form.Label>
                <Form.Control
                  type="time"
                  name="activity_time"
                  placeholder="Activity Time"
                  value={formData.activity_time}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
          </Row>

          <br />
          <Form.Group>
            <Form.Label className="required">Activity Type</Form.Label>
            <Form.Select
              name="activity_type"
              required={true}
              value={formData.activity_type}
              onChange={(e) =>
                onChange({
                  target: { name: "activity_type", value: e.target.value },
                })
              }
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="event">Event</option>
              <option value="mailer">Mailer</option>
              <option value="visit">Visit</option>
            </Form.Select>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label className="required">Activity Notes</Form.Label>
            <MentionsField
              value={formData.activity_details}
              handleChange={(e) =>
                onChange({
                  target: { name: "activity_details", value: e.target.value },
                })
              }
              singleLine={false}
              required={true}
              onUserAdd={handleUserMention}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            className="me-2"
            onClick={() => {
              setData(defaultValues);
              toggle();
            }}
            disabled={false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              formData.activity_date === "" ||
              formData.activity_time === "" ||
              formData.activity_type === "" ||
              formData.activity_details === "" ||
              formData.referral_source === null ||
              api.isLoading
            }
          >
            {api.isLoading ? (
              <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
            ) : (
              "Add"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

AddActivityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSource: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default AddActivityModal;
