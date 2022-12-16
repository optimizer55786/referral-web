import React from "reactn";
import PropTypes from "prop-types";

const Tactics = ({ refSource }) => {
  return <p>Tactics</p>;
};

Tactics.propTypes = {
  refSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Tactics;
