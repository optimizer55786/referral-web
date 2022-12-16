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
        {capitalizeWords(record.referral_source_type)}{" "}
        {record.referral_source_parent_name ? (
          <span>@ {record.referral_source_parent_name}</span>
        ) : null}
      </small>
    </components.Option>
  );
};

const ReferralSourceSelect = ({ value, isMulti = false, onChange }) => {
  const loadOptions = async (term) => {
    const results = await makeRequest(
      "get",
      `/referral-sources?search=${term}`
    );
    return results.rows.map((item) => {
      return {
        value: item.referral_source_id,
        label: item.referral_source_name,
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
    />
  );
};

ReferralSourceSelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default ReferralSourceSelect;
