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
    // set most of the default
    Object.keys(fd).forEach((k) => {
      fd[k] = referralSource[k] || "";
    });

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

const ReferralSourceForm = ({ referralSource, onCancel, onComplete, type}) => {
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

    return fields.map((f, fIndex) => {
      return (
        <DynamicField
          {...f}
          key={fIndex}
          className="mb-4"
          name={`meta.${f.name}`}
          value={get(formData.meta, f.name, "")}
          onChange={onChange}
        />
      );
    });
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
      url: referralSource ? `/referral-sources/${referralSource.referral_source_id}` : "/referral-sources",
      method: referralSource ? "put" : "post",
      payload
    });
  };

  return (
    <form onSubmit={onSubmit}>
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
      <br />
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
      <br />
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
      <br />
      <Form.Group>
        <Form.Label className="required">Referral Source Rating</Form.Label>
        <Form.Select
          name="referral_source_rating"
          value={formData.referral_source_rating}
          onChange={onChange}
          required={true}
          disabled={(referralSource && !referralSource.isManager)}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="null">Null</option>
        </Form.Select>
      </Form.Group>
      <br />
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

ReferralSourceForm.propTypes = {
  referralSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default ReferralSourceForm;
