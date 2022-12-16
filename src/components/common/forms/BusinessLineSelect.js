import React from "reactn";
import PropTypes from "prop-types";
import Async from "react-select/async";
import { components } from "react-select";

import { makeRequest } from "../../../hooks/useApi";

const Input = (props) => {
  return <components.Input {...props} />;
};

const Option = (props) => {
  return (
    <components.Option {...props}>
      <p className="mb-0">{props.children}</p>
    </components.Option>
  );
};

const BusinessLineSelect = ({ value, isMulti = false, onChange }) => {
  const loadOptions = async (term) => {
    const results = await makeRequest("get", `/business-lines?search=${term}`);
    return results.rows.map((item) => {
      return {
        value: item.business_line_id,
        label: item.business_line_name,
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
      defaultOptions={true}
      onChange={onChange}
      value={value}
    />
  );
};

BusinessLineSelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default BusinessLineSelect;
