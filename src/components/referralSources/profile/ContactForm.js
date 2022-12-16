import React from "reactn";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import get from "lodash.get";

import { useApiWrite } from "../../../hooks/useApi";
import { useFormData } from "../../../hooks/useFormData";
import ReferralSourceSelect from "../../common/forms/ReferralSourceSelect";
import DynamicField from "../../common/forms/DynamicField";
import * as meta from "../meta";

const getDefaultFormData = (referralSource, type) => {
  const fd = {
    referral_source_name: "",
    referral_source_type: type,
    referral_source_npi: "",
    referral_source_parent: "",
    referral_source_notes: "",
    meta: {},
  };

  if (referralSource) {
    // update the parent
    if (referralSource.referral_source_parent_id) {
      fd.referral_source_parent = {
        value: referralSource.referral_source_parent_id,
        label: referralSource.referral_source_parent_name,
        record: null,
      };
    }
  }

  return fd;
};

const ContactForm = ({ referralSource, onCancel, onComplete, type}) => {
  const { formData, onChange, setData } = useFormData(
    getDefaultFormData(referralSource, type ? type : "contact")
  );

  const api = useApiWrite(
    (resp) => {
      toast.success("Your referral source has been successfully saved.");
      onComplete(resp);
    },
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const renderMetaFields = () => {
    const fields = meta[formData.referral_source_type];

    return <Row>{
      fields.map((f, fIndex) => {
        return (
          <Col key={fIndex} xs={12} sm={6}>
            <DynamicField
              {...f}
              className="mb-4"
              name={`meta.${f.name}`}
              value={get(formData.meta, f.name, "")}
              onChange={onChange}
            />
          </Col>
        );
      })
    }
    </Row>;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      referral_source_name: formData.referral_source_name,
      referral_source_parent_id: formData.referral_source_parent
        ? formData.referral_source_parent.value
        : null,
      referral_source_notes: formData.referral_source_notes || null,
      meta: { ...formData.meta },
    };

    api.mutate({
      url: "/referral-sources",
      method: "post",
      payload
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Row>
        <Col xs={12} sm={6}>
          <Form.Group>
            <Form.Label className="required">Referral Source Name</Form.Label>
            <Form.Control
              type="text"
              name="referral_source_name"
              value={formData.referral_source_name}
              onChange={onChange}
              required={true}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Group>
            <Form.Label className="required">Referral Source Type</Form.Label>
            <Form.Select
              name="referral_source_type"
              value={formData.referral_source_type}
              onChange={onChange}
              required={true}
              disabled={(referralSource && referralSource.referral_source_npi) || type}
            >
              <option value="facility">Facility</option>
              <option value="provider">Provider</option>
              <option value="contact">Contact</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12} sm={6}>
          <Form.Group>
            <Form.Label>Referral Source NPI</Form.Label>
            <Form.Control
              type="text"
              name="referral_source_npi"
              value={formData.referral_source_npi}
              onChange={onChange}
              disabled={referralSource && referralSource.referral_source_npi}
            />
            <small className="text-muted">
              <FontAwesomeIcon icon={faInfoCircle} /> If you provide an NPI here, we
              will attempt to verify it and connect it to our AI-empowered data
              sets.
            </small>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Group>
            <Form.Label>Referral Source Primary Parent</Form.Label>
            <ReferralSourceSelect
              value={formData.referral_source_parent}
              onChange={(val) =>
                onChange({
                  target: { name: "referral_source_parent", value: val },
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <br />
      {renderMetaFields()}
      <Form.Group>
        <Form.Label className="required">Notes</Form.Label>
        <Form.Control
          as="textarea"
          name="referral_source_notes"
          value={formData.referral_source_notes}
          onChange={onChange}
          required={true}
          placeholder="Notes..."
        />
      </Form.Group>

      <hr />
      <Row>
        <Col>
          <Button variant="link" onClick={() => onCancel()}>
            Cancel
          </Button>
        </Col>
        <Col className="text-end">
          <Button type="submit" variant="primary" disabled={api.isLoading}>
            Save
          </Button>
        </Col>
      </Row>
    </form>
  );
};

ContactForm.propTypes = {
  referralSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default ContactForm;
