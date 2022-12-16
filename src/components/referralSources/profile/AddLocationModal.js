import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPost } from "../../../hooks/useApi";

const AddLocationModal = ({show, toggle, referralSource, onSuccess}) => {
  const defaultValues = {
    referral_source: referralSource
      ? {
          value: referralSource.referral_source_id,
          label: referralSource.referral_source_name,
          record: referralSource,
        }
      : null,
    street_1: "",
    street_2: "",
    city: "",
    state: "",
    zip: "",
  };
  const { formData, onChange, setData } = useFormData(defaultValues);

  const api = useApiPost(
    `/referral-sources/${referralSource.referral_source_id}/address`,
    (resp) => {
      setData(defaultValues);
      toggle();
      toast.success("Location added successfully!");
      onSuccess(resp);
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  const onSubmit = (e) => {
    e.preventDefault();
    api.mutate(formData);
  };
  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Add Location</Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit} id="new-location-form">
        <Modal.Body>
          <Row>
            <Col >
              <Form.Group>
                <Form.Label className="required">Street 1</Form.Label>
                <Form.Control
                  type="text"
                  name="street_1"
                  placeholder="Street 1"
                  value={formData.street_1}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="required">Street 2</Form.Label>
                <Form.Control
                  type="text"
                  name="street_2"
                  placeholder="Street 2"
                  value={formData.street_2}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Row>
            <Col >
              <Form.Group>
                <Form.Label className="required">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="required">State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="required">Zip</Form.Label>
                <Form.Control
                  type="text"
                  name="zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChange={onChange}
                  required={true}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            className="me-2"
            onClick={() => { 
              setData(defaultValues);
              toggle();
            }}
            disabled={false}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={
              formData.street_1 === "" ||
              formData.city === "" ||
              formData.state === "" ||
              formData.zip === "" ||
              api.isLoading
            }
          >
              {api.isLoading ? (
                <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
              ) : (
                "Add"
              )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

AddLocationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSource: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default AddLocationModal;
