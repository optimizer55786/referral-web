import React from "reactn";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

const ContentBlock = ({
  title,
  titleRight,
  children,
  className,
  styles,
  fullHeight = true,
}) => {
  const style = styles ? { ...styles } : {};

  if (fullHeight) {
    style.height = "100%";
  }

  return (
    <Card className={className || ""} style={style}>
      {title ? (
        <Card.Header>
          {titleRight ? <div className="float-end">{titleRight}</div> : null}
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
      ) : null}
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};

ContentBlock.propTypes = {
  title: PropTypes.any,
  titleRight: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
  fullHeight: PropTypes.bool,
};

export default ContentBlock;
