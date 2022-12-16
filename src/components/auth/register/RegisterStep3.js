import React, { useState } from "reactn";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  FloatingLabel,
  FormControl,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-solid-svg-icons";

import SmallCard from "../../common/SmallCard";

const pricing = [
  {
    title: "Analysis Only",
    icon: null,
    price: 399,
    period: "quarterly",
    features: [
      "Competition Analysis",
      "Lost Opportunities",
      "Market Trends",
      "Market Referral Sources by Diagnosis",
      "Group Practice Analysis",
      "Instant Access To Many More!",
    ],
  },
  {
    title: "Intelligence Platform",
    icon: null,
    price: 179,
    period: "monthly",
    features: [
      "CMS Market Data",
      "Referral Source Management",
      "Lead Tracking",
      "AI Insights",
      "Referral Source Key Points",
      "Run Rate Tracking",
      "Community and Strategy Platform",
      "EMR Integration",
      "Plus All Reports",
    ],
  },
  {
    title: "AI-Powered Platform",
    icon: null,
    price: 299,
    period: "monthly",
    features: [
      "AI-Powered Intelligence Tools",
      "Custom KPI's",
      "Custom Alerting",
      "CMS Market Data",
      "Referral Source Management",
      "Lead Tracking",
      "AI Insights",
      "Referral Source Key Points",
      "Run Rate Tracking",
      "Community and Strategy Platform",
      "EMR Integration",
      "Plus All Reports",
    ],
  },
];

const RegisterStep3 = ({ data, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    plan: "",
    nameOnCard: "",
    cardInfo: "",
    agree: false,
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

  console.log("plan: ", formData.plan);

  return (
    <form onSubmit={onSubmit}>
      <Row>
        {pricing.map((item, i) => {
          return (
            <Col xs={12} md={4} className="mb-3">
              <SmallCard
                key={i}
                style={{
                  backgroundColor:
                    formData.plan !== "" && formData.plan !== item.title
                      ? "#f3f3f3"
                      : "#fff",
                }}
              >
                <h5 className="text-primary">
                  {item.title}
                  <br />
                  <small>
                    ${item.price}/{item.period}
                  </small>
                </h5>
                <hr />
                <ul>
                  {item.features.map((f, n) => {
                    return <li key={n}>{f}</li>;
                  })}
                </ul>
                <Button
                  variant={
                    formData.plan === item.title ? "primary" : "outline-primary"
                  }
                  style={{ display: "block", width: "100%" }}
                  onClick={() => setFormData({ ...formData, plan: item.title })}
                >
                  Select Plan
                </Button>
              </SmallCard>
            </Col>
          );
        })}
      </Row>
      <FloatingLabel label="Name On Credit Card" className="mb-3">
        <FormControl
          type="text"
          name="nameOnCard"
          placeholder="Name On Card"
          value={formData.nameOnCard}
          onChange={(e) =>
            setFormData({ ...formData, nameOnCard: e.target.value })
          }
          required={true}
        />
      </FloatingLabel>
      <FloatingLabel label="Credit Card Info" className="mb-3">
        <FormControl
          type="text"
          name="cardNum"
          placeholder="4444 4444 4444 4444"
          value={formData.cardNum}
          onChange={(e) =>
            setFormData({ ...formData, cardNum: e.target.value })
          }
          required={true}
        />
      </FloatingLabel>

      <Row>
        <Col xs={12} md={6} className="mb-3">
          <Row>
            <FloatingLabel
              label="Exp Mo"
              style={{
                maxWidth: 150,
                display: "inline-block",
              }}
            >
              <FormControl
                type="text"
                name="cardMo"
                placeholder="01"
                value={formData.cardMo}
                onChange={(e) =>
                  setFormData({ ...formData, cardMo: e.target.value })
                }
                required={true}
              />
            </FloatingLabel>
            <FloatingLabel
              label="Exp Yr"
              style={{ maxWidth: 150, display: "inline-block" }}
            >
              <FormControl
                type="text"
                name="cardYr"
                placeholder="21"
                value={formData.cardYr}
                onChange={(e) =>
                  setFormData({ ...formData, cardYr: e.target.value })
                }
                required={true}
              />
            </FloatingLabel>
          </Row>
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <FloatingLabel
            label="Security Code"
            style={{ maxWidth: 250, display: "inline-block" }}
          >
            <FormControl
              type="text"
              name="cardYr"
              placeholder="01"
              value={formData.cardYr}
              onChange={(e) =>
                setFormData({ ...formData, cardYr: e.target.value })
              }
              required={true}
            />
          </FloatingLabel>
        </Col>
      </Row>

      <hr />

      <Form.Check
        type="checkbox"
        label={
          <span>
            By checking this box, you agree to our{" "}
            <Link
              to="/privacy-policy"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-of-use"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              Terms of Use
            </Link>
            .
          </span>
        }
        checked={formData.agree}
        onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
      />

      <div className="d-grid gap-4 mt-5">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || formData.plan === ""}
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSync} spin={true} />
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegisterStep3;
