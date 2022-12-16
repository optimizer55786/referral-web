import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

import Loading from "../../common/Loading";
import OrgSelect from "../../common/forms/OrgSelect";
import RoleSelect from "../../common/forms/RoleSelect";
import { useFormData } from "../../../hooks/useFormData";
import { useApiWrite, useApiGetResource } from "../../../hooks/useApi";
import { capitalizeWords } from "../../../lib/stringHelpers";

const formDefaults = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  timezone: "America/Chicago",
  password: "",
  confirm: "",
  org: null,
  role: null,
};

const UserFormModal = ({ show, toggle, userId, values, onSuccess }) => {
  const [title, setTitle] = useState("Edit User");
  const [showPass, setShowPass] = useState(true);
  const { formData, onChange, setData } = useFormData(formDefaults);
  const timezones = {
    "America/New_York": "Eastern",
    "America/Chicago": "Central",
    "America/Los_Angeles": "Pacific",
    "America/Anchorage": "Alaskan",
    "America/Honolulu": "Hawaii-Aletian",
  };

  const { isLoading, data } = useApiGetResource(
    `/users`,
    userId && userId !== "new" ? userId : null,
    null,
    {
      onError: (err) => toast.error(err.message),
    }
  );

  useEffect(() => {
    if (userId === "new") {
      setShowPass(true);
      setData(formDefaults);
      setTitle("Add User");
    } else {
      setShowPass(false);
      setData(values || formDefaults);
      setTitle("Edit User");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    setData(values, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (data) {
      const record = {
        ...data,
        org: { value: data.org_id, label: data.org_name },
        role: { value: data.role_id, label: capitalizeWords(data.role_name) },
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
      role_id: formData.role ? formData.role.value : null,
      org_id: formData.org ? formData.org.value : null,
    };

    delete payload.org;
    delete payload.role;

    if (!showPass) {
      delete payload.password;
      delete payload.confirm;
    }

    if (!payload.role_id) {
      toast.error("Please select a role before saving.");
      return;
    } else if (!payload.org_id) {
      toast.error("Please select an organization before saving.");
      return;
    }

    if (userId && userId === "new") {
      apiWrite.mutate({ url: `/users`, method: "POST", payload });
    } else if (userId) {
      apiWrite.mutate({ url: `/users/${userId}`, method: "PUT", payload });
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
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={onChange}
                      placeholder="First Name"
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={onChange}
                      placeholder="Last Name"
                      required={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Email"
                  required={true}
                />
              </Form.Group>

              {userId && userId !== "new" && !showPass ? (
                <Button
                  variant="link"
                  onClick={() => setShowPass(true)}
                  className="ps-0 mb-3"
                >
                  Change Password
                </Button>
              ) : null}
              {showPass ? (
                <>
                  <Row>
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={onChange}
                          placeholder="Password"
                          required={true}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm"
                          value={formData.confirm}
                          onChange={onChange}
                          placeholder="Confirm Password"
                          required={true}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <p className="mb-1">
                    <FontAwesomeIcon icon={faInfoCircle} /> Passwords must meet
                    the following requirements:
                  </p>
                  <ul style={{ columns: 2 }}>
                    <li>
                      At least <strong>8 characters</strong> in length
                    </li>
                    <li>
                      At least <strong>1 upper case</strong> letter
                    </li>
                    <li>
                      At least <strong>1 lower case</strong> letter
                    </li>
                    <li>
                      At least <strong>1 number</strong>
                    </li>
                    <li>
                      At least <strong>1 special</strong> character
                    </li>
                  </ul>
                </>
              ) : null}

              <Row>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <RoleSelect
                      value={formData.role}
                      onChange={(val) =>
                        onChange({ target: { name: "role", value: val } })
                      }
                      isMulti={false}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      as={InputMask}
                      mask="999-999-9999"
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={onChange}
                      placeholder="Mobile"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Timezone</Form.Label>
                    <Form.Select
                      name="timezone"
                      value={formData.timezone}
                      onChange={onChange}
                      required={true}
                    >
                      {Object.keys(timezones).map((k, i) => {
                        return (
                          <option key={i} value={k}>
                            {timezones[k]}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Organization</Form.Label>
                    <OrgSelect
                      value={formData.org}
                      onChange={(val) =>
                        onChange({ target: { name: "org", value: val } })
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

UserFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  userId: PropTypes.string,
  values: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default UserFormModal;
