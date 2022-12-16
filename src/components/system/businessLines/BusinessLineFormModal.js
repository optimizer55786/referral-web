import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

import Loading from "../../common/Loading";
import { useFormData } from "../../../hooks/useFormData";
import { useApiWrite, useApiGetResource } from "../../../hooks/useApi";

const formDefaults = {
  business_line_name: "",
  business_line_key: "",
  business_line_show: true,
};

const BusinessLineFormModal = ({
  show,
  toggle,
  businessLineId,
  values,
  onSuccess,
}) => {
  const [title, setTitle] = useState("Edit Business Line");
  const { formData, onChange, setData } = useFormData(formDefaults);

  const { isLoading, data } = useApiGetResource(
    `/business-lines`,
    businessLineId && businessLineId !== "new" ? businessLineId : null,
    null,
    {
      onError: (err) => toast.error(err.message),
    }
  );

  useEffect(() => {
    if (businessLineId === "new") {
      setData(formDefaults);
      setTitle("Add Business Line");
    } else {
      setData(values || formDefaults);
      setTitle("Edit Business Line");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessLineId]);

  useEffect(() => {
    setData(values, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (data) {
      const record = {
        ...data,
      };

      setData(record, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const apiWrite = useApiWrite(
    (resp) => {
      if (onSuccess) {
        onSuccess(resp);
      }
      toggle();
    },
    {
      onError: (err) => toast.error(err.message),
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };

    if (businessLineId && businessLineId === "new") {
      apiWrite.mutate({ url: `/business-lines`, method: "POST", payload });
    } else if (businessLineId) {
      apiWrite.mutate({
        url: `/business-lines/${businessLineId}`,
        method: "PUT",
        payload,
      });
    }
  };

  return (
    <Modal show={show} onHide={toggle} size="lg">
      <form onSubmit={onSubmit} autoComplete="off">
        <Modal.Header closeButton={true}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Loading msg="Loading business line..." />
          ) : (
            <>
              <Row>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="business_line_name"
                      value={formData.business_line_name}
                      onChange={onChange}
                      placeholder="Business Line Name"
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Key</Form.Label>
                    <Form.Control
                      type="text"
                      name="business_line_key"
                      value={formData.business_line_key}
                      onChange={onChange}
                      placeholder="Business Line Key"
                      required={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Check
                label="Show In Reports"
                type="checkbox"
                id="business_line_show"
                onChange={(e) =>
                  onChange({
                    target: {
                      name: "business_line_show",
                      value: e.target.checked,
                    },
                  })
                }
                checked={formData.business_line_show}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => toggle()}
            disabled={apiWrite.isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={apiWrite.isLoading}>
            {apiWrite.isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinnerThird} spin={true} /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

BusinessLineFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  businessLineId: PropTypes.string,
  values: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default BusinessLineFormModal;
