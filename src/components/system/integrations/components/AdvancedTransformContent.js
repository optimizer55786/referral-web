import React, { useRef } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button, Accordion } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";

import { useApiPost } from "../../../../hooks/useApi";

const EditorWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
`;

const AdvancedTransformContent = ({ integrationSettings }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const getValue = () => {
    const val = editorRef.current.getValue();
    console.log(val);
    return val;
  };

  const callApi = useApiPost(
    "/integrations/advanced-transform",
    (res) => {
      toast.success(
        "Your advanced transform function has been successfully saved."
      );
    },
    {
      onError: (err) => toast.error(err.message),
    }
  );

  return (
    <div>
      <p className="lead">
        Create custom transformation code using the editor below. This function
        will be called for each record after it has been through the field
        mapping process.
      </p>

      <Row>
        <Col md={8}>
          <EditorWrapper className="mb-3 mt-3">
            <Editor
              height="500px"
              defaultLanguage="javascript"
              defaultValue={
                integrationSettings
                  ? integrationSettings.integration_setting_advanced
                  : `/**
 * DO NOT CHANGE THE FUNCTION SIGNATURE
 *
 * @param row {object} the raw, unmapped row from the import data
 * @param mapped {object} the cleaned mapped version
 * @param utils {object} a collection of utility functions
 * @return {object}
 */
const handler = async (row, mapped, utils) => {
  // don't modify arguments
  const clean = {...mapped};

  // transform fields like below
  // clean.length_of_stay = 15;

  // using a search in utils
  // const results = await utils.findNpi(clean.referral_source_npi);

  // using moment to convert a date string form one format to another
  // const startOfCareDate = utils.moment(clean.soc_date, "MM/DD/YYYY").format("YYYY-MM-DD");

  // ensure you return your mapped data
  return clean;
}`
              }
              onMount={handleEditorDidMount}
            />
          </EditorWrapper>
        </Col>

        <Col>
          <h5 className="mt-2">Documentation</h5>
          <hr />
          <Accordion defaultKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>utils.moment()</Accordion.Header>
              <Accordion.Body>Access the momentjs object.</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>utils.findNpi()</Accordion.Header>
              <Accordion.Body>
                Search Referral Sources and CMS data for the provided NPI.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>utils.searchReferralSources()</Accordion.Header>
              <Accordion.Body>
                Search the accounts existing referral sources by various
                attributes.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>utils.searchReferrals()</Accordion.Header>
              <Accordion.Body>
                Search the accounts existing referrals by various attributes.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <div className="text-end">
        <Button
          variant="primary"
          onClick={() =>
            callApi.mutate({
              code: getValue(),
            })
          }
          disabled={callApi.isLoading}
        >
          <FontAwesomeIcon
            icon={callApi.isLoading ? faSpinnerThird : faCheck}
            fixedWidth={true}
            spin={callApi.isLoading}
          />{" "}
          {callApi.isLoading ? "Saving..." : "Save Function"}
        </Button>
      </div>
    </div>
  );
};

AdvancedTransformContent.propTypes = {
  integrationSettings: PropTypes.object,
};

export default AdvancedTransformContent;
