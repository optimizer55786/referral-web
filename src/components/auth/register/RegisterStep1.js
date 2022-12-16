import React, { useState } from "reactn";
import { Link } from "react-router-dom";
import { Row, Col, Button, FloatingLabel, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-solid-svg-icons";

const RegisterStep1 = ({ data, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    ...data,
  });

  const onSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onComplete({ ...formData });
    }, 1500);
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <p className="lead text-center mb-3">
        Complete the steps below to get started in minutes!
      </p>

      <Row>
        <Col xs={12} md={6} className="mb-5">
          <FloatingLabel label="Your First Name" className="mb-3">
            <FormControl
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required={true}
            />
          </FloatingLabel>
          <FloatingLabel label="Your Last Name" className="mb-3">
            <FormControl
              type="text"
              name="lastName"
              placeholder="Smith"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required={true}
            />
          </FloatingLabel>
          <FloatingLabel label="Email Address" className="mb-3">
            <FormControl
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required={true}
            />
          </FloatingLabel>
        </Col>

        <Col sm={12} md={6} className="mb-5">
          <FloatingLabel label="Your Password" className="mb-3">
            <FormControl
              type="password"
              name="password"
              placeholder="secret"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={true}
              autoComplete="new-password"
            />
          </FloatingLabel>
          <FloatingLabel label="Confirm Your Password" className="mb-3">
            <FormControl
              type="password"
              name="confirm"
              placeholder="secret"
              value={formData.confirm}
              onChange={(e) =>
                setFormData({ ...formData, confirm: e.target.value })
              }
              required={true}
              autoComplete="new-password"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <div className="d-grid gap-4 mt-3">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <FontAwesomeIcon icon={faSync} spin={true} />
          ) : (
            "Next Step"
          )}
        </Button>
        <p className="text-center">
          Already have an account? <Link to="/sign-in">Sign in here!</Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterStep1;
