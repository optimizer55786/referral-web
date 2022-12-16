import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-regular-svg-icons";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import { useEffect } from "react";

const EditLocationModal = ({show, toggle, referralSource, onSuccess, address}) => {
  const defaultValues = {
    street_1: address.street_1 ,
    street_2: address.street_2 ,
    city: address.city,
    state: address.state,
    zip: address.zip,
  };
  const { formData, onChange, setData } = useFormData(defaultValues);
  const api = useApiPut(
    `/referral-sources/address/${address.address_id}`,
    (resp) => {
      setData(defaultValues);
      toggle();
      toast.success("Location updated successfully!");
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
    const payload = {
      street_1: formData.street_1,
      street_2: formData.street_2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    }
    api.mutate(payload);
  };

  useEffect(() => {
    setData(address);
  },[address]);
  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Update Location</Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit} id="update-location-form">
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
                  value={formData.street_2 ?? ""}
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
                "Update"
              )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

EditLocationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  referralSource: PropTypes.object,
  onSuccess: PropTypes.func,
  address: PropTypes.object.isRequired
};

export default EditLocationModal;
