import React from "reactn";
import PropTypes from "prop-types";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/pro-regular-svg-icons";

import MainLayout from "..//MainLayout";

const Error404 = () => {
  return (
    <MainLayout>
      <section>
        <Container>
          <h1>
            <FontAwesomeIcon icon={faHome} /> Error404
          </h1>
          <p className="lead">This is the sub header.</p>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Error404;
