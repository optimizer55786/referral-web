import React, { useGlobal } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import UserSelect from "../common/forms/UserSelect";
import { useFormData } from "../../hooks/useFormData";
import { useApiPost } from "../../hooks/useApi";
import { getBusinessLineById } from "../../lib/businessLineHelpers";

const ReferralSourceAssignment = ({
  show,
  toggle,
  referralSourceIds,
  onSuccess,
}) => {
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const { formData, onChange } = useFormData({
    businessLineId: selectedBusinessLineId,
    user: null,
    assignChildren: false,
    removeOthers: false,
    removeExisting: false,
  });
  const businessLine = getBusinessLineById(selectedBusinessLineId);

  const api = useApiPost(
    "/referral-sources/assign",
    (res) => {
      toggle();
      if (onSuccess) {
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
      assignChildren: formData.assignChildren,
      removeOthers: formData.removeOthers,
      removeExisting: false, // formData.removeExisting,
      businessLineId: formData.businessLineId,
    });
  };

  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>
          Assign Referral Source{referralSourceIds.length > 1 ? "s" : ""}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <p className="lead mb-3">
            Use the form below to assign{" "}
            <strong>
              {referralSourceIds.length} referral source
              {referralSourceIds.length > 1 ? "s" : ""}
            </strong>
            . This assignment will only apply to the{" "}
            <strong>{businessLine.business_line_name}</strong> business line.
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Assign To</Form.Label>
            <UserSelect
              value={formData.user}
              onChange={(val) =>
                onChange({ target: { name: "user", value: val } })
              }
              isMulti={false}
              scoped={true}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="cb-assign-children"
              label="Assign all children as well"
              checked={formData.assignChildren}
              onChange={(e) =>
                onChange({
                  target: { name: "assignChildren", value: e.target.checked },
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="cb-remove-others"
              label={`Remove other assigned ${businessLine.business_line_name} users`}
              checked={formData.removeOthers}
              onChange={(e) =>
                onChange({
                  target: { name: "removeOthers", value: e.target.checked },
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
            Assign User
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

ReferralSourceAssignment.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccess: PropTypes.func,
};

export default ReferralSourceAssignment;
