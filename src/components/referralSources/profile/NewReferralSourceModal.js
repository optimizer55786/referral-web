import React from "reactn";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import  ReferralSourceForm from "./ReferralSourceForm";

const NewReferralSourceModal = ({show, toggle, onSuccess, type}) => {

  return (
    <Modal show={show} onHide={toggle} size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title>New Referral Source</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReferralSourceForm 
          onCancel={toggle}
          onComplete={(res)=>{
            onSuccess(res);
            toggle();
          }}
          type={type}
        />
      </Modal.Body>
    </Modal>
  );
};

NewReferralSourceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  type: PropTypes.string
};

export default NewReferralSourceModal;
