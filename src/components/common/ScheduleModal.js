import React, { useGlobal, useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import  ScheduleForm from "./ScheduleForm";
import { makeRequest } from "../../hooks/useApi";

const ScheduleModal = ({show, toggle, referralSource, onSuccess, scheduleId }) => {
  const [user] = useGlobal("user");
  const [schedule, setSchedule] = useState(undefined);
  useEffect(async ()=>{
    if(scheduleId){
      let res = await makeRequest("get", `/schedule/${scheduleId}`);
      setSchedule(res)
    } else {
      setSchedule(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId])
  return (
    <Modal show={show} onHide={toggle} size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title>Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScheduleForm 
          referralSource={referralSource}
          schedule={ schedule === undefined ? null : schedule }
          manager={user.role_name != 'rep'}
          onCancel={toggle}
          onComplete={(res)=>{
            onSuccess(res);
            toggle();
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

ScheduleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSource: PropTypes.object,
  onSuccess: PropTypes.func,
  scheduleId: PropTypes.string
};

export default ScheduleModal;
