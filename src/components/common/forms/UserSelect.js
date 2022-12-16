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
        {capitalizeWords(record.role_name)}
        {record.org_id ? ` / ${record.org_name}` : ""}
      </small>
    </components.Option>
  );
};

const UserSelect = ({
  value,
  isMulti = false,
  scoped = false,
  onChange,
  showDefaultOptions = false,
}) => {
  const loadOptions = async (term) => {
    const results = await makeRequest(
      "get",
      `/users/search?search=${term}&select=1${scoped ? "&scoped=1" : ""}`
    );
    return results.rows.map((item) => {
      return {
        value: item.user_id,
        label: item.name,
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

UserSelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default UserSelect;
