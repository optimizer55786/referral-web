import React from "reactn";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import Loading from "./Loading";

const LoadingModal = ({ show, toggle, msg }) => {
  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Body>
        <Loading msg={msg} />
      </Modal.Body>
    </Modal>
  );
};

LoadingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  LoadingModal: PropTypes.string,
};

export default LoadingModal;
