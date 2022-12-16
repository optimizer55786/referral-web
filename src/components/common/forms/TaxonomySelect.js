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
      <small className="text-muted">
        {record.grouping}
        {record.specialization ? (
          <>
            <br />
            {record.specialization}
          </>
        ) : null}
      </small>
    </components.Option>
  );
};

const TaxonomySelect = ({ value, isMulti = false, onChange }) => {
  const loadOptions = async (term) => {
    const results = await makeRequest("get", `/cms/taxonomy?search=${term}`);
    return results.rows.map((item) => {
      return {
        value: item.code,
        label: item.classification,
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

TaxonomySelect.propTypes = {
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default TaxonomySelect;
