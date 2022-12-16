import React, { useState } from "reactn";
import Async from "react-select/async";
import { components } from "react-select";

import { makeRequest } from "../../hooks/useApi";

const Input = (props) => {
  return <components.Input {...props} />;
};

const Option = (props) => {
  const details = props.data.context;

  return (
    <components.Option {...props} style={{ background: "#fff" }}>
      <p className="mb-0">{props.children}</p>
      {details.subtext ? (
        <small className="text-muted">{details.subtext}</small>
      ) : null}
    </components.Option>
  );
};

const QueryBuilderInput = () => {
  const [value, setValue] = useState([]);
  const [context, setContext] = useState([]);

  const loadOptions = async (term) => {
    const results = await makeRequest("post", `/ai/builder/step`, {
      term,
      context,
    });
    return results.suggestions.map((item) => {
      return {
        value: item.value,
        label: item.label,
        context: item.context,
      };
    });
  };

  const onChange = (vals) => {
    setValue(vals);
    setContext(vals.map((v) => v.context));
  };

  const getColorFromState = (state) => {
    const details = state.data.context;
    switch (details.type) {
      case "entity":
        return "green";
      case "group":
        return "blue";
      case "filter":
        return "red";
      default:
        return "#000";
    }
  };

  return (
    <Async
      components={{ Option, Input }}
      isMulti={true}
      isClearable={true}
      isSearchable={true}
      loadOptions={loadOptions}
      defaultOptions={true}
      onChange={onChange}
      value={value}
      placeholder="Ask Celestia..."
      styles={{
        multiValue: (provided, state) => ({
          ...provided,
          background: "#fff",
          fontWeight: "700",
          color: getColorFromState(state),
        }),
        multiValueLabel: (provided, state) => ({
          ...provided,
          color: getColorFromState(state),
        }),
      }}
    />
  );
};

export default QueryBuilderInput;
