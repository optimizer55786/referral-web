import React, { useState } from "reactn";
import { Row, Col, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

import { useApiPost } from "../../../../hooks/useApi";
import { useFormData } from "../../../../hooks/useFormData";

import QueryBuilderInput from "../../../celestia/QueryBuilderInput";

const QueryBuilderTest = () => {
  const { formData, onChange, setData } = useFormData({ search: "" });
  const [queries, setQueries] = useState([]);
  const [results, setResults] = useState(null);

  const callApi = useApiPost(
    "/ai/builder/run",
    (res) => {
      setResults(res);
      setQueries([...queries, res.query]);
      setData({ search: "" });
    },
    { onError: (err) => toast.error(err.message) }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    callApi.mutate({
      query: formData.search,
      opts: null,
    });
  };

  return (
    <div>
      <p className="lead">
        Use this tool to test the Query Builder input tool for running ad-hoc
        queries/reports.
      </p>
      <form onSubmit={onSubmit} autoComplete="off">
        <Row>
          <Col xs={10}>
            <Form.Group>
              <QueryBuilderInput />
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Button type="submit" variant="primary" className="w-100">
              <FontAwesomeIcon
                icon={callApi.isLoading ? faSpinnerThird : faPlay}
                fixedWidth={true}
                spin={callApi.isLoading}
              />{" "}
              {callApi.isLoading ? "Running..." : "Run"}
            </Button>
          </Col>
        </Row>
      </form>
      <hr />

      <Row>
        <Col xs={8}>
          <h5>Query Results</h5>
          {results ? (
            <pre>{JSON.stringify(results, undefined, 2)}</pre>
          ) : (
            <p>No results to show.</p>
          )}
        </Col>
        <Col>
          <h5>Search History</h5>
          {queries.length === 0 ? (
            <p>No search history to show.</p>
          ) : (
            queries.map((q, qIndex) => (
              <Button
                variant="link"
                onClick={() =>
                  onChange({ target: { name: "search", value: q } })
                }
                className="p-0 mb-2"
              >
                {q}
              </Button>
            ))
          )}
        </Col>
      </Row>
    </div>
  );
};

export default QueryBuilderTest;
