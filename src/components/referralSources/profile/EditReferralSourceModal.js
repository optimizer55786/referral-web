import React from "reactn";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import  ReferralSourceForm from "./ReferralSourceForm";

const EditReferralSourceModal = ({show, toggle, referralSource, onSuccess}) => {
  return (
    <Modal show={show} onHide={toggle} size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title>Update Referral Source</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReferralSourceForm 
          referralSource={referralSource}
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

EditReferralSourceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSource: PropTypes.object,
  onSuccess: PropTypes.func
};

export default EditReferralSourceModal;
