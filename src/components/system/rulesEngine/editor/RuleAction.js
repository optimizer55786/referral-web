import React from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";

const getEventVerb = (eventType) => {
  if (!eventType) {
    return "read";
  }

  return eventType.split("::")[1] === "get" ? "read" : "write";
};

const RuleAction = ({ action, eventType, schema, onChange, onRemove }) => {
  const eventVerb = getEventVerb(eventType);

  const handleChange = (e) => {
    onChange({ ...action, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-2">
      <Row>
        <Col sm={3}>
          <Form.Select name="type" value={action.type} onChange={handleChange}>
            {schema.actions[eventVerb].map((event, eventIndex) => (
              <option key={eventIndex} value={event.key}>
                {event.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Control
            as="textarea"
            name="message"
            value={action.message}
            onChange={handleChange}
          />
        </Col>
        <Col sm={1}>
          <Button variant="outline-danger" onClick={() => onRemove()}>
            <FontAwesomeIcon icon={faTrash} fixedWidth={true} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RuleAction;
