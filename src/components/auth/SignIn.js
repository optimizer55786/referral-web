import React, { useGlobal, useState, useDispatch, useEffect } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { Button, FloatingLabel, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSync } from "@fortawesome/pro-solid-svg-icons";

import SignInLayout from "../layout/SignInLayout";
import ContentBlock from "../common/ContentBlock";
import { useApiPost } from "../../hooks/useApi";

const SignIn = () => {
  const [user] = useGlobal("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const login = useDispatch("login");
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const auth = useApiPost(
    "/auth/login",
    (resp) => {
      login(resp);
      history.push("/");
    },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    auth.mutate(formData);
  };

  return (
    <SignInLayout>
      <ContentBlock>
        <h1 className="text-center mb-5">
          {process.env.REACT_APP_BRANDING_TITLE}{" "}
          <small style={{ fontSize: "0.75rem", display: "block" }}>
            powered by The Referral Lab
          </small>
        </h1>

        <p className="lead text-center mb-3">
          Welcome back! Enter your credentials below to continue.
        </p>

        <form onSubmit={onSubmit}>
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
            />
          </FloatingLabel>
          <div className="text-end">
            <Button type="text" variant="link" size="sm">
              <FontAwesomeIcon icon={faLock} /> Forgot your password?
            </Button>
          </div>

          <div className="d-grid gap-4 mt-5">
            <Button type="submit" variant="primary" disabled={auth.isLoading}>
              {auth.isLoading ? (
                <FontAwesomeIcon icon={faSync} spin={true} />
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/register">Create an account in minutes!</Link>
            </p>
          </div>
        </form>
      </ContentBlock>
      <p className="footer-copy">&copy; 2021 Referral Lab, LLC</p>
    </SignInLayout>
  );
};

export default SignIn;
