import React from "reactn";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons";

import MainLayout from "../../layout/MainLayout";
import Loading from "../../common/Loading";
import { useApiGet } from "../../../hooks/useApi";

const PublicProfile = () => {
  const { userId } = useParams();
  const { isLoading, isFetching, data } = useApiGet(
    `public-profile-${userId}`,
    `/users/profile/${userId}`,
    null,
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );

  return (
    <MainLayout title="Test">
      {isLoading || isFetching ? (
        <Loading msg="Loading user profile..." />
      ) : (
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
      )}
    </MainLayout>
  );
};

export default PublicProfile;
