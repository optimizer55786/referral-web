import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

import Loading from "../../common/Loading";
import OrgSelect from "../../common/forms/OrgSelect";
import BusinessLineSelect from "../../common/forms/BusinessLineSelect";
import { useFormData } from "../../../hooks/useFormData";
import { useApiWrite, useApiGetResource } from "../../../hooks/useApi";

const formDefaults = {
  org_name: "",
  org_type: "office",
  org: null,
  businessLine: null,
};

const OrganizationFormModal = ({ show, toggle, orgId, values, onSuccess }) => {
  const [title, setTitle] = useState("Edit Organization");
  const { formData, onChange, setData } = useFormData(formDefaults);

  const { isLoading, data } = useApiGetResource(
    `/organizations`,
    orgId && orgId !== "new" ? orgId : null,
    null,
    {
      onError: (err) => toast.error(err.message),
    }
  );

  useEffect(() => {
    if (orgId === "new") {
      setData(formDefaults);
      setTitle("Add Organization");
    } else {
      setData(values || formDefaults);
      setTitle("Edit Organization");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  useEffect(() => {
    setData(values, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (data) {
      const record = {
        ...data,
        org: data.parent_org_id
          ? { value: data.parent_org_id, label: data.parent_org_name }
          : null,
        businessLine: {
          value: data.business_line_id,
          label: data.business_line_name,
        },
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
      org_name: formData.org_name,
      org_type: formData.org_type,
      parent_org_id: formData.org ? formData.org.value : null,
      business_line_id: formData.businessLine
        ? formData.businessLine.value
        : null,
    };

    if (!payload.business_line_id) {
      toast.error("Please select a business line before saving.");
      return;
    }

    if (orgId && orgId === "new") {
      apiWrite.mutate({ url: `/organizations`, method: "POST", payload });
    } else if (orgId) {
      apiWrite.mutate({
        url: `/organizations/${orgId}`,
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
            <Loading msg="Loading user..." />
          ) : (
            <>
              <Row>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="org_name"
                      value={formData.org_name}
                      onChange={onChange}
                      placeholder="Organization Name"
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="org_type"
                      value={formData.org_type}
                      onChange={onChange}
                    >
                      {["office", "branch", "territory", "region"].map(
                        (t, i) => {
                          return (
                            <option value={t} key={i}>
                              {t}
                            </option>
                          );
                        }
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Parent Organization</Form.Label>
                    <OrgSelect
                      value={formData.org}
                      onChange={(val) =>
                        onChange({ target: { name: "org", value: val } })
                      }
                      isMulti={false}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Business Line</Form.Label>
                    <BusinessLineSelect
                      value={formData.businessLine}
                      onChange={(val) =>
                        onChange({
                          target: { name: "businessLine", value: val },
                        })
                      }
                      isMulti={false}
                    />
                  </Form.Group>
                </Col>
              </Row>
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

OrganizationFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  orgId: PropTypes.string,
  values: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default OrganizationFormModal;
