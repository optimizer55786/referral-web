import React from "reactn";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import  ContactForm from "./ContactForm";

const NewContactModal = ({show, toggle, onSuccess, type, parentReferral}) => {

  return (
    <Modal show={show} onHide={toggle} size="lg">
      <Modal.Header closeButton={true}>
        <Modal.Title>New Referral Source</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ContactForm 
          onCancel={toggle}
          referralSource={parentReferral}
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

NewContactModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  type: PropTypes.string,
  parentReferral: PropTypes.object
};

export default NewContactModal;
