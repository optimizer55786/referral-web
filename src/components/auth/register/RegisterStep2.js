import React, { useState } from "reactn";
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
import { faSync, faQuestionCircle } from "@fortawesome/pro-solid-svg-icons";

import SmallCard from "../../common/SmallCard";

const RegisterStep2 = ({ data, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    state: "",
    ...data,
  });

  const search = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSearchResults({
        company: {
          name: "Sample Home Health, INC",
          npi: 123456789,
          address: "123 Main St, STE 100, Jacksonville, NC 12345",
        },
        counties: [
          {
            name: "Sample County",
            state: "NC",
            totals: { facilities: 22, providers: 75 },
          },
          {
            name: "Another County",
            state: "NC",
            totals: { facilities: 13, providers: 40 },
          },
        ],
        totals: {
          facilities: 35,
          providers: 115,
          estimatedReferrals: 349,
          marketshare: 22,
        },
      });
    }, 1500);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onComplete({ ...formData });
    }, 1500);
  };

  const onConfirm = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onComplete({ ...formData, company: searchResults.company });
    }, 1500);
  };

  const renderSearchResults = () => {
    if (searchResults === null) {
      return null;
    }

    return (
      <>
        <h5 className="mb-3">It looks like we found your organization!</h5>
        <p className="mb-5">
          Based on what we've found, your onboarding should be quick and easy.
          Please confirm your organization details below:
        </p>
        <SmallCard>
          <h5>{searchResults.company.name}</h5>
          <p className="mb-0">NPI: {searchResults.company.npi}</p>
          <p>{searchResults.company.address}</p>
        </SmallCard>

        <SmallCard title="Does this list of counties where you have marketshare look correct?">
          <ul>
            {searchResults.counties.map((county, i) => {
              return (
                <li key={i}>
                  {county.name}, {county.state}
                </li>
              );
            })}
          </ul>
        </SmallCard>

        <SmallCard
          title={
            <>
              How about this review of your market from <strong>Q1 2021</strong>
              ?
            </>
          }
        >
          <ul>
            <li>Total Facilities: {searchResults.totals.facilities}</li>
            <li>Total Providers: {searchResults.totals.providers}</li>
            <li>
              Esitmated Referrals*: {searchResults.totals.estimatedReferrals}
            </li>
            <li>Overall Market Share: {searchResults.totals.marketshare}%</li>
          </ul>
        </SmallCard>

        <div className="d-grid gap-4 mt-5">
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => onConfirm()}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSync} spin={true} />
            ) : (
              "This is my organization!"
            )}
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setSearchResults(null);
            }}
          >
            No, this isn't my organization.
          </Button>
        </div>
      </>
    );
  };

  const renderForm = () => {
    if (searchResults !== null) {
      return null;
    }

    return (
      <>
        <p className="lead text-center mb-3">
          Complete the small form below to help us identify the company you work
          for.
        </p>
        <FloatingLabel label="Your Company Name" className="mb-3">
          <FormControl
            type="text"
            name="company"
            placeholder="Company Name, LLC"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            required={true}
          />
        </FloatingLabel>

        <FloatingLabel label="State" className="mb-3">
          <Form.Select
            name="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            required={true}
          >
            <option value="">Select One</option>
            <option value="NC">North Carolina</option>
          </Form.Select>
        </FloatingLabel>
        <small className="text-muted">
          <FontAwesomeIcon icon={faQuestionCircle} /> This should be the state
          where you operate.
        </small>

        <div className="d-grid gap-4 mt-5">
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => search()}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSync} spin={true} />
            ) : (
              "Next Step"
            )}
          </Button>
        </div>
      </>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      {renderForm()}
      {renderSearchResults()}
    </form>
  );
};

export default RegisterStep2;
