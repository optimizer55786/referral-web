import React, { useGlobal, useState, useDispatch, useEffect } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { Button, FloatingLabel, FormControl, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faUser } from "@fortawesome/pro-solid-svg-icons";

import SignInLayout from "../layout/SignInLayout";
import ContentBlock from "../common/ContentBlock";

import RegisterStep1 from "./register/RegisterStep1";
import RegisterStep2 from "./register/RegisterStep2";
import RegisterStep3 from "./register/RegisterStep3";

const Register = () => {
  const [user] = useGlobal("user");
  const [completeData, setCompleteData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const login = useDispatch("login");
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const showStep = () => {
    switch (step) {
      case 1:
        return (
          <RegisterStep2
            data={{}}
            onComplete={(data) => {
              console.log(data);
              setCompleteData({ ...completeData, step2: data });
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <RegisterStep3 data={{}} onComplete={(data) => console.log(data)} />
        );
      default:
        return (
          <RegisterStep1
            data={{}}
            onComplete={(data) => {
              console.log(data);
              setCompleteData({ ...completeData, step1: data });
              setStep(1);
            }}
          />
        );
    }
  };

  return (
    <SignInLayout mdCellWidth={{ offset: 1, span: 10 }}>
      <ContentBlock>
        <h1 className="text-center mb-5">
          {process.env.REACT_APP_BRANDING_TITLE}{" "}
          <small style={{ fontSize: "0.75rem", display: "block" }}>
            powered by The Referral Lab
          </small>
        </h1>

        {showStep()}
      </ContentBlock>
      <p className="footer-copy">&copy; 2021 Referral Lab, LLC</p>
    </SignInLayout>
  );
};

export default Register;
