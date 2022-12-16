import React, { useGlobal } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import UserSelect from "../../common/forms/UserSelect";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPost } from "../../../hooks/useApi";

const TargetModal = ({ show, toggle, referralSourceIds, onSuccess }) => {
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const [user] = useGlobal("user");
  const { formData, onChange } = useFormData({
    businessLineId: selectedBusinessLineId,
    user: { label: user.name, value: user.user_id, record: user },
    autoAssign: true,
    removeExisting: false,
  });

  const api = useApiPost(
    "/referral-sources/target",
    (res) => {
      toggle();
      if (onSuccess) {
        toast.success("Referral Source is targeted successfully!");
        onSuccess(res);
      }
    },
    {
      onError: (err) => toast.error(err.message),
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    api.mutate({
      referralSourceIds: referralSourceIds,
      userId: formData.user.value,
      autoAssign: formData.autoAssign,
      removeExisting: formData.removeExisting,
      businessLineId: formData.businessLineId,
    });
  };

  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>
          Target Referral Source{referralSourceIds.length > 1 ? "s" : ""}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <p className="lead mb-3">
            Use the form below to target{" "}
            <strong>
              {referralSourceIds.length} referral source
              {referralSourceIds.length > 1 ? "s" : ""}
            </strong>
            .
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Target To</Form.Label>
            <UserSelect
              value={formData.user}
              onChange={(val) =>
                onChange({ target: { name: "user", value: val } })
              }
              isMulti={false}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="cb-auto-assign"
              label="Auto assign users to referral source."
              checked={formData.autoAssign}
              onChange={(e) =>
                onChange({
                  target: { name: "autoAssign", value: e.target.checked },
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="cb-remove-existing"
              label="Remove existing targeted referral source(s)."
              checked={formData.removeExisting}
              onChange={(e) =>
                onChange({
                  target: { name: "removeExisting", value: e.target.checked },
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            className="me-2"
            onClick={() => toggle()}
            disabled={api.isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={api.isLoading}>
            Target User
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

TargetModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccess: PropTypes.func,
};

export default TargetModal;
