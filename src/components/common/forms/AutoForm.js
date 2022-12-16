import React from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useFormData } from "../../../hooks/useFormData";
import { useApiPost, useApiPut } from "../../../hooks/useApi";

const AutoForm = ({ fields, values, onSuccess }) => {};

AutoForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
    })
  ),
  values: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default AutoForm;
