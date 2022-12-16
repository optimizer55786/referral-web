import React, { useGlobal, useState } from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCog,
  faPen,
} from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";
import { toast } from "react-toastify";

import CustomDropdown from "../../common/CustomDropdown";
import { capitalizeWords } from "../../../lib/stringHelpers";

const StyledLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
`;

const Small = styled.small`
  font-size: 1.15rem;
  margin-left: 1rem;
`;

const Info = ({ referral }) => {
  const [user] = useGlobal("user");

  return (
    <>
      <StyledLink to="/referrals">
        <FontAwesomeIcon icon={faChevronLeft} /> Back to Referrals
      </StyledLink>
      <h3>
        {referral.patient_name}
      </h3>
      
    </>
  );
};

Info.propTypes = {
  ref: PropTypes.shape({
    ref_id: PropTypes.string.isRequired,
    ref_name: PropTypes.string.isRequired,
  }),
};

export default Info;
