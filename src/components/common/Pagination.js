import React from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/pro-solid-svg-icons";

const Pagination = ({
  page,
  limit,
  returnedCount,
  totalCount,
  onPageChange,
}) => {
  const getRecordRange = () => {
    if (totalCount === 0) {
      return 0;
    }

    const p = page - 1;
    const base = p * limit + 1;

    return base;
  };

  return (
    <Row>
      <Col xs={12} sm={6} className="mb-3">
        <span>
          {totalCount === 0 ? (
            "0 of 0"
          ) : (
            <>
              {getRecordRange()} to {getRecordRange() + returnedCount - 1} of{" "}
              {totalCount}
            </>
          )}
        </span>
      </Col>
      <Col xs={12} sm={6} className="mb-3 text-end">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page - 1)}
          className="me-2"
          disabled={page <= 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Previous
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => onPageChange(page + 1)}
          disabled={Math.ceil(totalCount / limit) <= page}
        >
          Next <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </Col>
    </Row>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  returnedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
