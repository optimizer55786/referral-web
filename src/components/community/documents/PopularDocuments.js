import React from "reactn";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons";

import Loading from "../../common/Loading";
import { useApiGet } from "../../../hooks/useApi";

const PopularDocuments = () => {
  const { isLoading, isFetching, data } = useApiGet(
    "popular-docs",
    "/community/documents/popular",
    null,
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );

  if (isLoading || isFetching) {
    return <Loading msg="Loading popular documents..." />;
  }

  if (data.rows.length === 0) {
    return <p className="lead text-center">No documents were found.</p>;
  }

  return (
    <Row>
      {data.rows.map((file, i) => {
        return (
          <Col xs={12} sm={4} md={3} key={i}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  fontSize: "2rem",
                  marginRight: "0.5rem",
                  color: "#d8e2ef",
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} fixedWidth={true} />
              </div>
              <div>
                <Link
                  to={file.doc_url}
                  style={{ fontWeight: 700, textDecoration: "none" }}
                >
                  {file.doc_name}
                </Link>
                <br />
                <small className="text-muted">
                  {file.doc_views} views &middot;{" "}
                  {moment(file.doc_uploaded_on).format("M/D/YYYY")}
                </small>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default PopularDocuments;
