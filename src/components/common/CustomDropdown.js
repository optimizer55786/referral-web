import React from "reactn";
import PropTypes from "prop-types";
import { Dropdown, Button, ButtonGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/pro-solid-svg-icons";

const CustomToggle = React.forwardRef(
  ({ onClick, label, variant, icon, className }, ref) => {
    const getLabel = () => {
      if (!label && !icon) {
        return <FontAwesomeIcon icon={faEllipsisH} />;
      }

      return (
        <>
          {icon ? <FontAwesomeIcon icon={icon} fixedWidth={true} /> : null}
          {icon && label ? " " : null}
          {label ? label : null}
        </>
      );
    };

    return (
      <Button
        ref={ref}
        size="sm"
        variant={variant || "light"}
        className={className || ""}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {getLabel()}
      </Button>
    );
  }
);

const CustomDropdown = ({
  menuItems,
  label,
  icon,
  variant,
  clickData,
  className,
}) => {
  return (
    <Dropdown as={ButtonGroup} drop="start" className="no-caret">
      <Dropdown.Toggle
        as={CustomToggle}
        label={label}
        icon={icon}
        variant={variant}
        className={className}
      />
      <Dropdown.Menu>
        {menuItems.map((item, itemIndex) => {
          if (item.divider) {
            return <Dropdown.Divider key={itemIndex} />;
          }
          if (item.isVisible && item.isVisible(clickData) === false){
            return null;
          }
          return (
            <Dropdown.Item
              key={itemIndex}
              eventKey={itemIndex + 1}
              onClick={() => item.onClick(clickData || null)}
              className={item.className || ""}
              disabled={item.isDisabled ? item.isDisabled(clickData) : false}
            >
              {item.icon ? (
                <span className="me-2">
                  <FontAwesomeIcon icon={item.icon} fixedWidth={true} />
                </span>
              ) : null}
              <span>{item.label}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

CustomDropdown.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      divider: PropTypes.bool,
      label: PropTypes.string,
      onClick: PropTypes.func,
      isDisabled: PropTypes.func,
      isVisible: PropTypes.func
    })
  ),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.string,
  clickData: PropTypes.object,
};

export default CustomDropdown;
