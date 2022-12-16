import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import rrule from "rrule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/pro-regular-svg-icons";
import { faPen } from "@fortawesome/pro-solid-svg-icons";

import { capitalizeWords } from "../../lib/stringHelpers";

const RecurringEventTool = ({ value, onChange }) => {
  const [display, setDisplay] = useState(value || "");
  const [str, setStr] = useState(value || "");
  const [inEdit, setInEdit] = useState(false);

  const parseText = (valStr) => {
    // convert numbers to their string versions
    let tmp = valStr
      .replace(/one/g, "1")
      .replace(/two/g, "2")
      .replace(/three/g, "3")
      .replace(/four/g, "4")
      .replace(/five/g, "5")
      .replace(/six/g, "6")
      .replace(/seven/g, "7")
      .replace(/eight/g, "8")
      .replace(/nine/g, "9")
      .replace(/zero/g, "0");

    const rule = rrule.fromText(tmp);

    return rule;
  };

  useEffect(() => {
    if (value !== "") {
      try {
        const rule = rrule.fromString(value);
        setStr(rule.toText());
        setDisplay(rule.toText());
      } catch (err) {
        setStr("");
        setDisplay("");
      }
    }
  }, [value]);

  const onSubmit = (e) => {
    e.preventDefault();

    try {
      const rule = parseText(str);
      const text = rule.toText();

      setDisplay(text);
      setStr(text);
      setInEdit(false);

      if (onChange) {
        onChange(rule.toString());
      }
    } catch (err) {
      alert("Invalid string");
    }
  };

  const renderEditor = () => {
    return (
      <form onSubmit={onSubmit}>
        <Row>
          <Col xs={7}>
            <Form.Group>
              <Form.Control
                type="text"
                value={str}
                onChange={(e) => setStr(e.target.value)}
                placeholder="every week on monday"
              />
            </Form.Group>
          </Col>
          <Col xs={5}>
            <Button type="submit" variant="primary" size="sm">
              Save
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setInEdit(false);
                setStr(display);
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
        <p className="text-muted mb-0">
          <FontAwesomeIcon icon={faQuestionCircle} /> Examples: "every week on
          monday"; "every other week on Thursday"; "every month on the first
          wednesday"
        </p>
      </form>
    );
  };

  const renderSchedule = () => {
    return (
      <Button
        size="sm"
        variant="link"
        className="m-0 p-0"
        onClick={() => setInEdit(!inEdit)}
      >
        {str === "" ? (
          "Set A Visit Schedule"
        ) : (
          <>
            <FontAwesomeIcon icon={faPen} /> {capitalizeWords(display)}
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="recurring-event-tool">
      {inEdit ? renderEditor() : renderSchedule()}
    </div>
  );
};

RecurringEventTool.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default RecurringEventTool;
