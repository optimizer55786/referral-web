import React from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AssignedLabel = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="mb-0">Unassigned</p>;
  }

  return (
    <div>
      {users
        .map((u, uIndex) => (
          <Link key={uIndex} to={`/users/profile/${u.user_id}`}>
            {u.user_name} ({u.business_line_key})
          </Link>
        ))
        .reduce((prev, cur) => [prev, ", ", cur])}
    </div>
  );
};

AssignedLabel.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      user_name: PropTypes.string.isRequired,
      business_line_key: PropTypes.string.isRequired,
    })
  ),
};

export default AssignedLabel;
