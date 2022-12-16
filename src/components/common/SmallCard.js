import React from "reactn";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CustomDropdown from "./CustomDropdown";

import "./css/SmallCard.css";

const SmallCard = ({ title, onClick, actions = [], icon, style, children }) => {
  const classes = ["small-card", "mb-3"];
  const styles = style
    ? { ...style, cursor: onClick ? "pointer" : "inherit" }
    : { cursor: onClick ? "pointer" : "inherit" };

  if (onClick) {
    classes.push("hover");
  }

  return (
    <div
      className={classes.join(" ")}
      style={styles}
      onClick={() => (onClick ? onClick() : null)}
    >
      <Row>
        {icon ? (
          <Col xs={3} sm={2} style={{ fontSize: "2rem", textAlign: "center" }}>
            <FontAwesomeIcon icon={icon} fixedWidth={true} />
          </Col>
        ) : null}
        <Col>
          {actions && actions.length > 0 ? (
            <div className="float-end">
              <CustomDropdown menuItems={actions} />
            </div>
          ) : null}
          {title ? <small>{title}</small> : null}
          {children}
        </Col>
      </Row>
    </div>
  );
};

SmallCard.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.any,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  children: PropTypes.node.isRequired,
};

export default SmallCard;
