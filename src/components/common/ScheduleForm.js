import React, { useEffect, useDispatch }  from "reactn";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import { Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";

import ReferralSourceSelect from "./forms/ReferralSourceSelect";
import UserSelect from "./forms/UserSelect";
import { useFormData } from "../../hooks/useFormData";
import { useApiWrite } from "../../hooks/useApi";

const getDefaultFormData = (schedule, referralSource) => {
  if (schedule) {
    return {
      user: {
        value: schedule.user_id,
        label: schedule.user_name,
        record: null
      },
      referral_source: {
        value: schedule.referral_source_id,
        label: schedule.referral_source_name,
        record: referralSource || null,
      },
      recurring: schedule._schedule_text,
      schedule_start_date: moment
        .utc(schedule.schedule_start_date)
        .format("YYYY-MM-DD"),
      schedule_details: schedule.schedule_details ?? "",
    };
  }

  return {
    referral_source: referralSource
      ? {
          value: referralSource.referral_source_id,
          label: referralSource.referral_source_name,
          record: referralSource,
        }
      : null,
    recurring: "",
    schedule_start_date: moment.utc().format("YYYY-MM-DD"),
    schedule_details: "",
  };
};

const ScheduleForm = ({ schedule, referralSource, manager, onCancel, onComplete }) => {
  const { formData, onChange, setData } = useFormData(
    getDefaultFormData(schedule, referralSource)
  );
  const confirmation = useDispatch("confirmation");

  const api = useApiWrite(
    (resp) => {
      toast.success("Schedule has been successfully saved!")
      onComplete(resp);
    },
    { onError: (err) => toast.error(err.message) }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...(formData.user && manager? {user_id: formData.user.value} : {}),
      referral_source_id: formData.referral_source.value,
      schedule_rrule: formData.recurring,
      schedule_start_date: moment(formData.schedule_start_date, "YYYY-MM-DD")
        .set({ hour: 12, minute: 0, second: 0 })
        .toDate(),
      schedule_details: formData.schedule_details,
    };

    api.mutate({
      url: schedule ? `/schedule/${schedule.schedule_id}` : "/schedule",
      method: schedule ? "put" : "post",
      payload
    });
  };

  const handleDelete = () => {
    confirmation({
      asyncUrl: `/schedule/${schedule.schedule_id}`,
      asyncMethod: "delete",
      question:
        "Are you sure you want to delete the schedule?",
      onConfirm: () => {
        toast.success(
          "The schedule was successfully removed."
        );
        onComplete();
      },
    });
  }

  useEffect(()=>{
    setData(getDefaultFormData(schedule, referralSource));
  },[schedule])

  return (
    <form onSubmit={onSubmit} id="new-schedule-form">
      {manager && (
        <Form.Group>
          <Form.Label className="required">User</Form.Label>            
          <UserSelect
              value={formData.user}
              onChange={(vals) => onChange({
                target: { name: "user", value: vals}
              })}
              isMulti={false}
            />              
          <br />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label className="required">Referral Source</Form.Label>
        <ReferralSourceSelect
          value={formData.referral_source}
          onChange={(val) => {
            onChange({
              target: { name: "referral_source", value: val },
            });
          }}
        />
      </Form.Group>
      <br />
      <Form.Group>
        <Form.Label className="required">Start Date</Form.Label>
        <Form.Control
          type="date"
          name="schedule_start_date"
          placeholder="Start Date"
          value={formData.schedule_start_date}
          onChange={onChange}
          required={true}
        />
      </Form.Group>
      <br />
      <Form.Group>
        <Form.Label>Recurring</Form.Label>
        <Form.Control
          type="text"
          name="recurring"
          placeholder="every week on Monday"
          value={formData.recurring}
          onChange={onChange}
        />
        <small className="d-block mt-2">
          <p>Examples:</p>
          <ul>
            <li>Every weekday</li>
            <li>Every week on Monday</li>
            <li>Every week on Monday, Wednesday</li>
            <li>Every 2 weeks on Friday</li>
            <li>Every month on the 1st monday</li>
          </ul>
        </small>
      </Form.Group>

      <Form.Group>
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          name="schedule_details"
          placeholder="Notes"
          value={formData.schedule_details}
          onChange={onChange}
          style={{ height: 125 }}
        />
      </Form.Group>
      <hr />
      <Row>
        <Col>
          <Button variant="link" className="ps-0" onClick={() => onCancel()}>
            Cancel
          </Button>
        </Col>
        <Col className="text-end">
          {
            schedule !== null ? (
              <>
                <Button
                  type="button"
                  variant="danger"
                  className="mr-2"
                  onClick={handleDelete}
                >
                  {api.isLoading ? (
                    <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
                  ) : (
                    "Delete"
                  )}
                </Button> &nbsp;
              </>
            ) : null
          }
          <Button
            type="submit"
            variant="primary"
            disabled={
              formData.schedule_start_date === "" ||
              formData.recurring === "" ||
              formData.referral_source === null
            }
          >
            {api.isLoading ? (
              <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
            ) : (
              "Save"
            )}
          </Button>
        </Col>
      </Row>
    </form>
  );
};

ScheduleForm.propTypes = {
  schedule: PropTypes.shape({
    schedule_id: PropTypes.string.isRequired,
  }),
  referralSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,  
  manager: PropTypes.bool.isRequired,
};

export default ScheduleForm;
