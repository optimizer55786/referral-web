import React from "reactn";
import PropTypes from "prop-types";
import Async from "react-select/async";
import { components } from "react-select";

import { makeRequest } from "../../../hooks/useApi";

const Input = (props) => {
  return <components.Input {...props} />;
};

const Option = (props) => {
  const record = props.data.record;

  return (
    <components.Option {...props}>
      <p className="mb-0">{props.children}</p>
      {record.parent_account_id ? (
        <small className="text-muted">{record.parent_account_name}</small>
      ) : null}
    </components.Option>
  );
};

const AccountSelect = ({
  value,
  isMulti = false,
  onChange,
  isClearable = true,
}) => {
  const loadOptions = async (term) => {
    const results = await makeRequest("get", `/accounts?search=${term}`);
    return results.rows.map((item) => {
      return {
        value: item.account_id,
        label: item.name,
        record: item,
      };
    });
  };

  return (
    <Async
      components={{ Option, Input }}
      isMulti={isMulti}
      isClearable={isClearable}
      isSearchable={true}
      loadOptions={loadOptions}
      defaultOptions={true}
      onChange={onChange}
      value={value}
    />
  );
};

AccountSelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default AccountSelect;
