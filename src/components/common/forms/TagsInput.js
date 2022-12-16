import React from "react";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/creatable";

const TagsInput = ({ value, onChange }) => {
  const handleChange = (newValue, actionMeta) => {
    onChange(newValue);
  };

  return (
    <CreatableSelect
      isClearable
      isMulti={true}
      onChange={handleChange}
      options={[{ label: "Test 1", value: "Test 1" }]}
      value={value || []}
    />
  );
};

TagsInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default TagsInput;
