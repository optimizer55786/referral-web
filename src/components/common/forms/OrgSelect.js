import React from "reactn";
import PropTypes from "prop-types";
import Async from "react-select/async";
import { components } from "react-select";

import { makeRequest } from "../../../hooks/useApi";
import { capitalizeWords } from "../../../lib/stringHelpers";

const Input = (props) => {
  return <components.Input {...props} />;
};

const Option = (props) => {
  const record = props.data.record;

  return (
    <components.Option {...props}>
      <p className="mb-0">{props.children}</p>
      <small className="text-muted">
        {capitalizeWords(record.org_type)} / {record.business_line_name}
      </small>
    </components.Option>
  );
};

const OrgSelect = ({ value, isMulti = false, scoped = false, onChange, type, showDefaultOptions = false }) => {
  const loadOptions = async (term) => {
    const results = await makeRequest(
      "get",
      `/organizations?search=${term}${scoped ? "&scoped=1" : ""}${type ? "&type="+type : ""}`
    );
    return results.rows.map((item) => {
      return {
        value: item.org_id,
        label: item.org_name,
        record: item,
      };
    });
  };

  return (
    <Async
      components={{ Option, Input }}
      isMulti={isMulti}
      isClearable={true}
      isSearchable={true}
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      defaultOptions={showDefaultOptions}
    />
  );
};

OrgSelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default OrgSelect;
