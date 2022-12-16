import React, { useEffect } from "reactn";
import { Link, useParams, useHistory } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCheck,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";

import MainLayout from "../../layout/MainLayout";
import ContentBlock from "../../common/ContentBlock";
import Loading from "../../common/Loading";
import Tabs from "../../common/Tabs";
import TagsInput from "../../common/forms/TagsInput";
import { useFormData } from "../../../hooks/useFormData";
import { useApiGetResource, useApiWrite } from "../../../hooks/useApi";

import RulesetEditor from "./editor/RulesetEditor";

const StyledLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
`;

const Ruleset = () => {
  const { rulesetId } = useParams();
  const { formData, onChange, setData } = useFormData({
    ruleset_title: "",
    ruleset_event_type: "referral_source::get",
    ruleset_rules: [],
    ruleset_meta: { tags: [] },
  });
  const history = useHistory();

  const { isLoading, data } = useApiGetResource("/rulesets", rulesetId, null, {
    onError: (err) => toast.error(err.message),
  });

  const saveApi = useApiWrite(
    (res) => {
      toast.success("Your ruleset has been successfully saved.");
      if (rulesetId === "new") {
        history.push(`/system/rules-engine/${res.ruleset_id}`);
      }
    },
    { onError: (err) => toast.error(err.message) }
  );

  useEffect(() => {
    if (data) {
      setData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = () => {
    const { ruleset_id, ...payload } = formData;
    saveApi.mutate({
      url: `/rulesets${ruleset_id ? `/${ruleset_id}` : ""}`,
      method: ruleset_id ? "put" : "post",
      payload,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loading msg="Loading ruleset..." />;
    } else if (!data && rulesetId !== "new") {
      return (
        <p className="lead text-center">
          The requested ruleset could not be load. Please refresh the page and
          try again.
        </p>
      );
    }

    return (
      <>
        <ContentBlock className="mb-3">
          <StyledLink to="/system/rules-engine">
            <FontAwesomeIcon icon={faChevronLeft} /> Back to Rules Engine
          </StyledLink>
          <Form.Group className="mt-2 mb-3">
            <Form.Control
              name="ruleset_title"
              size="lg"
              value={formData.ruleset_title}
              onChange={onChange}
              placeholder="Ruleset Name"
              required={true}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="required">Event Type</Form.Label>
                <Form.Select
                  name="ruleset_event_type"
                  value={formData.ruleset_event_type}
                  onChange={onChange}
                  required={true}
                >
                  <option value="referral_source::get">
                    Get Referral Source
                  </option>
                  <option value="referral_source::update">
                    Update Referral Source
                  </option>
                  <option value="referral_source::create">
                    Create Referral Source
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <TagsInput />
              </Form.Group>
            </Col>
          </Row>
        </ContentBlock>
        <ContentBlock className="mb-3" fullHeight={false}>
          <Tabs
            tabs={[
              {
                label: "Rules",
                content: (
                  <RulesetEditor
                    rules={formData.ruleset_rules}
                    eventType={formData.eventType}
                    onChange={(newRules) =>
                      onChange({
                        target: { name: "ruleset_rules", value: newRules },
                      })
                    }
                  />
                ),
              },
              { label: "Test", content: <p>Testing</p> },
            ]}
            contentBlock={false}
          />
          <br />
          <hr />
          <div className="text-end">
            <Link
              to="/system/rules-engine"
              className="btn btn-link"
              disabled={saveApi.isLoading}
            >
              Cancel
            </Link>
            <Button
              variant="primary"
              className="ms-2"
              onClick={() => onSubmit()}
              disabled={saveApi.isLoading}
            >
              <FontAwesomeIcon
                icon={saveApi.isLoading ? faSpinnerThird : faCheck}
                fixedWidth={true}
              />{" "}
              Save Ruleset
            </Button>
          </div>
        </ContentBlock>
      </>
    );
  };

  return <MainLayout>{renderContent()}</MainLayout>;
};

export default Ruleset;
