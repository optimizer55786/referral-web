import React from "reactn";
import { Row, Col, Form } from "react-bootstrap";

import ContentBlock from "../../common/ContentBlock";
import { capitalizeWords, camelToSnake } from "../../../lib/stringHelpers";
import * as schemas from "../meta";

const Meta = ({ refSource }) => {
  if (!schemas[refSource.referral_source_type]) {
    return null;
  }

  const fields = schemas[refSource.referral_source_type];

  return (
    <ContentBlock fullHeight={false} className="mb-3">
      <Row>
        {fields.map((field, fieldIndex) => {
          return (
            <Col xs={12} sm={6} md={3} className="mb-3" key={fieldIndex}>
              <Form.Group>
                <Form.Label>{field.label}</Form.Label>
                <p className="mb-0">{refSource.meta[field.name] || "-"}</p>
              </Form.Group>
            </Col>
          );
        })}
      </Row>
    </ContentBlock>
  );
};

export default Meta;
