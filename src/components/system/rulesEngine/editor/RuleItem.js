import React, { useState, useEffect } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";

const getOptions = (schema) => {
  return [
    <optgroup key={0} label="Schema">
      {Object.keys(schema.fields).map((fieldKey, fieldIndex) => (
        <option key={fieldIndex} value={fieldKey}>
          {schema.fields[fieldKey].label}
        </option>
      ))}
    </optgroup>,
    <optgroup key={1} label="Presets">
      {Object.keys(schema.presets).map((fieldKey, fieldIndex) => (
        <option key={fieldIndex} value={fieldKey}>
          {schema.presets[fieldKey].label}
        </option>
      ))}
    </optgroup>,
  ];
};

const RuleItem = ({ rule, eventType, schema, onChange, onRemove }) => {
  const [options, setOptions] = useState(getOptions(schema));

  useEffect(() => {
    setOptions(getOptions(schema));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  const isString = (val) => {
    return typeof val === "string" || typeof val === "number";
  };

  const formatValue = (val, op) => {
    let value = val;

    // check for an array operator and format the value accordingly
    if (
      ["in", "notIn", "contains", "doesNotContain"].includes(op) &&
      isString(value)
    ) {
      value = String(value)
        .split(",")
        .map((v) => v.trim());
    } else if (Array.isArray(value)) {
      value = value.join(", ");
    }

    // the rules engine processor is type-specific, so we need to ensure we are
    // sending in the right variable type for the comparison - numbers need to
    // be numbers
    if (typeof value === "string" && value.length > 0 && /^\d+$/.test(value)) {
      value = Number(value);
    }

    return value;
  };

  const handleChange = (e) => {
    const updates = { ...rule, [e.target.name]: e.target.value };

    // we need to ensure we are adding in a default path and removing an existing
    // path when swapping to a schema field
    if (typeof e._factPath === "string") {
      updates.path = e._factPath;
    } else if (e._factPath === null) {
      updates.path = undefined;
    }

    updates.value = formatValue(updates.value, updates.operator);

    onChange(updates);
  };

  const formatDisplayValue = (val) => {
    if (Array.isArray(val)) {
      return val.join(", ");
    }

    return val;
  };

  return (
    <div style={{ margin: "0.75rem 0" }}>
      <Row>
        <Col>
          <Form.Select
            name="fact"
            value={rule.fact}
            onChange={(e) => {
              if (!schema.fields[e.target.value]) {
                e._factPath = `$.${
                  Object.keys(schema.presets[e.target.value].paths)[0]
                }`;
              } else {
                e._factPath = null;
              }
              handleChange(e);
            }}
          >
            {options}
          </Form.Select>
        </Col>
        {!schema.fields[rule.fact] ? (
          <Col>
            <Form.Select name="path" value={rule.path} onChange={handleChange}>
              {Object.keys(schema.presets[rule.fact].paths).map(
                (presetKey, presetIndex) => (
                  <option key={presetIndex} value={`$.${presetKey}`}>
                    {schema.presets[rule.fact].paths[presetKey].label}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
        ) : null}

        <Col>
          <Form.Select
            name="operator"
            value={rule.operator}
            onChange={handleChange}
          >
            <optgroup label="String and Numeric">
              <option value="equal">Equal</option>
              <option value="notEqual">Not Equal</option>
            </optgroup>
            <optgroup label="Numeric">
              <option value="greaterThan">Greater Than</option>
              <option value="greaterThanInclusive">
                Greater Than Or Equal To
              </option>
              <option value="lessThan">Less Than</option>
              <option value="lessThanInclusive">Less Than Or Equal To</option>
            </optgroup>
            <optgroup label="Arrays/Lists">
              <option value="in">In List</option>
              <option value="notIn">Not In List</option>
              <option value="contains">Contains Item</option>
              <option value="doesNotContainer">Does Not Container Item</option>
            </optgroup>
          </Form.Select>
        </Col>

        <Col>
          <Form.Control
            name="value"
            value={formatDisplayValue(rule.value)}
            onChange={handleChange}
            placeholder="Value To Test Against"
          />
        </Col>
        <Col>
          <Button variant="outline-danger" onClick={() => onRemove()}>
            <FontAwesomeIcon icon={faTrash} fixedWidth={true} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RuleItem;
