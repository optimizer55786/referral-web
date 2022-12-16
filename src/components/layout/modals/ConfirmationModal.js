import React, { useDispatch, useGlobal, useState } from "reactn";
import { Modal, Button } from "react-bootstrap";
import { makeRequest } from "../../../hooks/useApi";
import { toast } from "react-toastify";

const ConfirmationModal = () => {
  const [busy, setBusy] = useState(false);
  const [confirmModal] = useGlobal("confirmModal");
  const closeConfirmation = useDispatch("closeConfirmation");

  const callApi = () => {
    setBusy(true);

    makeRequest(
      confirmModal.asyncMethod,
      confirmModal.asyncUrl,
      confirmModal.asyncPayload
    )
      .then((res) => {
        if (confirmModal.onConfirm) {
          confirmModal.onConfirm(res);
        }
        closeConfirmation();
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <Modal show={confirmModal.show} onHide={() => closeConfirmation()}>
      <Modal.Body>
        <p className="mb-0" style={{ fontSize: "1.25rem" }}>
          {confirmModal.question}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={confirmModal.declineButtonVariant}
          className="me-2"
          disabled={busy}
          onClick={() => {
            if (confirmModal.onCancel) {
              confirmModal.onCancel();
            }
            closeConfirmation();
          }}
        >
          {confirmModal.declineButtonLabel}
        </Button>
        <Button
          variant={confirmModal.confirmButtonVariant}
          disabled={busy}
          onClick={() => {
            if (confirmModal.asyncUrl) {
              callApi();
            } else if (confirmModal.onConfirm) {
              confirmModal.onConfirm();
              closeConfirmation();
            } else {
              closeConfirmation();
            }
          }}
        >
          {confirmModal.confirmButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
