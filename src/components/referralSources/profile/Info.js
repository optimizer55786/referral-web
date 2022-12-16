import React, { useGlobal, useState } from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faChevronLeft,
  faCog,
  faPen,
  faEdit,
  faMapPin,
  faUser,
  faPlus,
  faUserFriends,
  faBullseyeArrow
} from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";
import { toast } from "react-toastify";

import CustomDropdown from "../../common/CustomDropdown";
import { capitalizeWords } from "../../../lib/stringHelpers";
import ReferralSourceAssignment from "../ReferralSourceAssignment";
import { isUserAssigned } from "../../../lib/referralSourceHelpers";
import { useQueryClient } from "react-query";
import AddLocationModal from "./AddLocationModal";
import AddActivityModal from "./AddActivityModal";
import EditReferralSourceModal from "./EditReferralSourceModal";
import TargetModal from "./TargetModal";
import { useApiPost } from "../../../hooks/useApi";
import ScheduleModal from "../../common/ScheduleModal";
import NewContactModal from "./NewContactModal";

const StyledLink = styled(Link)`
  font-weight: 500;
  text-decoration: none;
`;

const Small = styled.small`
  font-size: 1.15rem;
  margin-left: 1rem;
`;

const Info = ({ refSource }) => {
  const [showAssign, setShowAssign] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showEditReferralSourceModal, setShowEditReferralSourceModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNewContactModal, setShowNewContactModalModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [user] = useGlobal("user");
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const queryClient = useQueryClient();
  const targetReferralSourcesApi = useApiPost(
    "/referral-sources/target",
    (resp) => {
      toast.success("Referral Source is targeted successfully!");
      queryClient.invalidateQueries()
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  )
  const getTitle = () => {
    switch (refSource.referral_source_type) {
      case "facility":
        return (
          <Small>
            <strong>{capitalizeWords(refSource.referral_source_type)}</strong>
            {refSource.meta.facilityType
              ? ` / ${capitalizeWords(refSource.meta.facilityType)}`
              : null}
          </Small>
        );

      case "provider":
      case "contact":
      default:
        return (
          <Small>
            <strong>{capitalizeWords(refSource.referral_source_type)}</strong>
            {refSource.meta.title
              ? ` / ${capitalizeWords(refSource.meta.title.toLowerCase())}`
              : null}
          </Small>
        );
    }
  };

  const isTargeted = () => {
    if(refSource._targeted_users.filter(u=>u.user_id === user.user_id).length){
      return(
        <FontAwesomeIcon icon={faBullseyeArrow} />
      )
    }
  }

  const handleAssign = () => {
    if(user.role_name === "rep" && refSource._assigned_users.length){
      if( isUserAssigned(refSource) === true ){
        toast.error("You do not have the required permissions to assign this referral source.");
        return;
      }
    }
    setShowAssign(true);
  }

  const handleTarget = () => {
    if (user.role_name !== 'rep'){
      setShowTargetModal(true);
    } else {
      targetReferralSourcesApi.mutate({
        referralSourceIds:[refSource.referral_source_id], 
        removeExisting: true, 
        businessLineId: selectedBusinessLineId
      });
    }
  }

  return (
    <>
      <StyledLink to="/referral-sources">
        <FontAwesomeIcon icon={faChevronLeft} /> Back to Referral Sources
      </StyledLink>
      <div className="float-end">
        <CustomDropdown
          label={
            <>
              <FontAwesomeIcon icon={faCog} /> Actions
            </>
          }
          menuItems={[
            {
              label: "Edit",
              icon: faPen,
              onClick: () => setShowEditReferralSourceModal(true),
            },
            {
              label: "Schedule",
              icon: faCalendarDay,
              onClick: () => setShowScheduleModal(true),
            },
            {
              label: "Assign",
              icon: faUser,
              onClick: handleAssign
            },
            {
              label: "Target",
              icon: faBullseyeArrow,
              onClick: handleTarget
            },
            {
              label: "Add Activity",
              icon: faEdit,
              onClick: () => setShowAddActivityModal(true),
            },
            {
              label: "Add Location",
              icon: faMapPin,
              onClick: () => setShowAddLocationModal(true),
            },
            {
              label: "Add Contact",
              icon: faPlus,
              onClick: () => setShowNewContactModalModal(true),
            },
          ]}
        ></CustomDropdown>
      </div>
      <h3>
        {refSource.referral_source_name} {isTargeted()} {getTitle()}
      </h3>
      
      <ReferralSourceAssignment
        show={showAssign}
        toggle={() => setShowAssign(false)}
        referralSourceIds={[refSource.referral_source_id]}
      />
      <AddLocationModal
        show = {showAddLocationModal}
        toggle = {() => setShowAddLocationModal(false)}
        referralSource = {refSource}
        onSuccess = {()=> queryClient.invalidateQueries(`ref-source-${refSource.referral_source_id}`)}
      />
      <AddActivityModal
        show={showAddActivityModal}
        toggle={() => setShowAddActivityModal(false)}
        referralSource={refSource}
        onSuccess = {()=> queryClient.invalidateQueries(`ref-source-${refSource.referral_source_id}`)}
      />
      <EditReferralSourceModal 
        show={showEditReferralSourceModal}
        toggle={() => setShowEditReferralSourceModal(false)}
        referralSource={refSource}
        onSuccess = {()=> queryClient.invalidateQueries()}
      />
      <ScheduleModal 
        show={showScheduleModal}
        toggle={() => setShowScheduleModal(false)}
        referralSource={refSource}
        onSuccess = {()=> queryClient.invalidateQueries()}
      />      
      <NewContactModal
        show={showNewContactModal}
        toggle={() => setShowNewContactModalModal(false)}
        type="contact"
        parentReferral={refSource}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <TargetModal 
        show={showTargetModal}
        toggle={() => setShowTargetModal(false)}
        referralSourceIds={[refSource.referral_source_id]}
        onSuccess = {()=> queryClient.invalidateQueries()}
      />
    </>
  );
};

Info.propTypes = {
  refSource: PropTypes.shape({
    referral_source_id: PropTypes.string.isRequired,
    referral_source_name: PropTypes.string.isRequired,
  }),
};

export default Info;
