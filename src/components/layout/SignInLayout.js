import React from "reactn";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { createGlobalStyle } from "styled-components";

import "./css/SignInLayout.css";

const SignInLayout = ({ children, mdCellWidth = null }) => {
  const cell = mdCellWidth || { offset: 4, span: 4 };

  const GlobalStyle = createGlobalStyle`
    body {
      background-image: url(${process.env.PUBLIC_URL}/images/sign-in-bg.jpg) !important;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
    }
  `;

  return (
    <>
      <GlobalStyle />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div id="signin-layout" style={{ zIndex: 2 }}>
            <Container>
              <Row>
                <Col xs={12} md={cell}>
                  {children}
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

SignInLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SignInLayout;
