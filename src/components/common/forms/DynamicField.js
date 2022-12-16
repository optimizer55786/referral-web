import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import InputMask from "react-input-mask";

const DynamicField = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  className = "",
  options = [],
  type = "text",
  required = false,
  subtext,
}) => {
  const renderControl = () => {
    switch (type) {
      case "select":
        return (
          <Form.Select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          >
            {options.map((opt, i) => {
              return (
                <option value={opt.value} key={i}>
                  {opt.label}
                </option>
              );
            })}
          </Form.Select>
        );
      case "checkbox":
        return (
          <Form.Control
            type={"checkbox"}
            name={name}
            value={name}
            label={label || ""}
            onChange={onChange}
            required={required}
            isChecked={value ? true : false}
          />
        );
      case "phone":
        return (
          <Form.Control
            as={InputMask}
            mask="999-999-9999"
            type={"text"}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder || ""}
          />
        );
      default:
        return (
          <Form.Control
            type={type || "text"}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder || ""}
          />
        );
    }
  };

  return (
    <Form.Group className={className}>
      {label && type !== "checkbox" ? (
        <Form.Label className={required ? "required" : ""}>{label}</Form.Label>
      ) : null}
      {renderControl()}
      {subtext ? <small className="text-muted">{subtext}</small> : null}
    </Form.Group>
  );
};

DynamicField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  subtext: PropTypes.string,
};

export default DynamicField;
