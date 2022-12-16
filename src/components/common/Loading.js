import React from "reactn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

const Loading = ({ msg = "Loading...", className, style }) => {
  return (
    <h3 className={className || "text-center"} style={style || {}}>
      <FontAwesomeIcon icon={faSpinnerThird} spin={true} /> {msg}
    </h3>
  );
};

export default Loading;
