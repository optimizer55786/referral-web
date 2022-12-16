import React, { useGlobal, useDispatch, useState } from "reactn";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTachometerAltFast,
  faCalendarWeek,
  faUserMd,
  faUserFriends,
  faBullseyePointer,
  faBell,
  faChevronDoubleLeft,
  faChevronDoubleRight,
  faUserInjured,
  faWrench,
  faCogs,
  faBallotCheck,
  faMap,
} from "@fortawesome/pro-solid-svg-icons";
import moment from "moment-timezone";

import QuantumModal from "../quantum/QuantumModal";
import useQuantum from "../../hooks/useQuantum";
import AccountSelect from "../common/forms/AccountSelect";

import ConfirmationModal from "./modals/ConfirmationModal";

import "./css/MainLayout.css";

const MainLayout = ({ children }) => {
  const [user] = useGlobal("user");
  const [businessLines] = useGlobal("businessLines");
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const [accounts] = useGlobal("accounts");
  const [selectedAccount] = useGlobal("selectedAccount");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const history = useHistory();
  const updateSelectedBusinessLine = useDispatch("updateSelectedBusinessLine");
  const updateSelectedAccount = useDispatch("updateSelectedAccount");
  const logout = useDispatch("logout");
  const { question, isVisible, ask, close } = useQuantum();
  const isSysAdmin = user.role_name === "sysadmin";
  const [toggle] = useGlobal("toggle");
  const setToggle = useDispatch("updateToggle");

  const links = [
    {
      label: "Dashboard",
      icon: faTachometerAltFast,
      to: "/",
      role: [],
    },
    {
      label: "Sales Pathways",
      icon: faBullseyePointer,
      to: "/sales-pathways",
      role: [],
      feature: "sales-pathways",
    },
    {
      label: "Calendar",
      icon: faCalendarWeek,
      to: "/calendar",
      role: [],
    },
    {
      label: "Map",
      icon: faMap,
      to: "/map",
      role: [],
    },
    {
      label: "Referral Sources",
      icon: faUserMd,
      to: "/referral-sources",
      role: [],
    },
    {
      label: "Referrals",
      icon: faUserInjured,
      to: "/referrals",
      role: [],
    },
    {
      label: "Referral Log",
      icon: faBallotCheck,
      to: "/referral-log",
      role: [],
      feature: ["referral-log"],
    },
    {
      label: "Community",
      icon: faUserFriends,
      to: "/community",
      role: [],
      children: [
        {
          label: "Overview",
          to: "/community",
          role: [],
        },
        {
          label: "Channels",
          to: "/community/channels",
          role: [],
        },
        {
          label: "Documents",
          to: "/community/documents",
          role: [],
        },
      ],
    },
    {
      label: "Tools",
      icon: faWrench,
      to: "/tools",
      role: [],
      feature: "tools",
    },
    {
      label: "System",
      icon: faCogs,
      to: "/system",
      role: ["sysadmin", "admin"],
      children: [
        {
          label: "Users",
          to: "/system/users",
          role: [],
        },
        {
          label: "Organizations",
          to: "/system/organizations",
          role: [],
        },
        {
          label: "Business Lines",
          to: "/system/business-lines",
          role: [],
        },
        {
          label: "Integrations",
          to: "/system/integrations",
          role: ["sysadmin"],
        },
        {
          label: "Referral Funnel",
          to: "/system/referral-funnel",
          role: [],
        },
        {
          label: "Rules Engine",
          to: "/system/rules-engine",
          role: [],
        },
        {
          label: "Events Log",
          to: "/system/events-log",
          role: [],
        },
        {
          label: "Custom Fields",
          to: "/system/custom-fields",
          role: [],
        },
        {
          label: "AI Tools",
          to: "/system/ai-tools",
          role: ["sysadmin"],
        },
      ],
    },
  ];

  const onSearch = (e) => {
    e.preventDefault();
    ask(searchTerm);
  };
  function renderLinkList(list, level = 0) {
    return list.map((link, i) => {
      const reg = new RegExp(`^${link.to}(?:/.*)?$`);
      const isActive = reg.test(location.pathname);

      if (
        link.role &&
        link.role.length > 0 &&
        !link.role.includes(user.role_name)
      ) {
        return null;
      }

      if (link.feature && !user._featureFlags.includes(link.feature)) {
        return null;
      }

      return (
        <div className="nav-item" key={`${i}-${level}`}>
          <Link to={link.to} className={isActive ? "active" : ""}>
            {link.icon ? (
              <FontAwesomeIcon
                icon={link.icon}
                fixedWidth={true}
                style={{ marginRight: "0.5rem" }}
              />
            ) : null}
            {link.label}
          </Link>
          {link.children && isActive ? (
            <div className="nav-sub-list">
              {renderLinkList(link.children, level + 1)}
            </div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div id="main-layout">
      <Container fluid={true}>
        <header>
          <div id="logo-wrapper">
            <Button
              type="button"
              variant="light"
              size="sm"
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              <FontAwesomeIcon
                icon={
                  toggle === false ? faChevronDoubleRight : faChevronDoubleLeft
                }
              />
            </Button>{" "}
            <h2
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginLeft: "1rem",
              }}
            >
              {process.env.REACT_APP_BRANDING_TITLE}
            </h2>
          </div>
          <Row id="header-wrapper">
            <Col xs={12} sm={3} md={isSysAdmin ? 6 : 8}>
              <form onSubmit={onSearch}>
                <Form.Control
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ask Celestia..."
                  style={{ maxWidth: 350, borderRadius: 20 }}
                />
              </form>
            </Col>
            {isSysAdmin ? (
              <Col xs={8} sm={3} md={2}>
                <AccountSelect
                  onChange={(val) => {
                    updateSelectedAccount(val);
                    window.location.reload();
                  }}
                  value={selectedAccount}
                  isClearable={false}
                />
              </Col>
            ) : null}
            {accounts ? (
              <Col xs={8} sm={3} md={2}>
                <Form.Select
                  value={selectedAccount.value}
                  onChange={(e) => {
                    const acct = accounts.find(
                      (a) => a.account_id === e.target.value
                    );
                    updateSelectedAccount({
                      value: acct.account_id,
                      label: acct.name,
                    });
                    window.location.reload();
                  }}
                ></Form.Select>
              </Col>
            ) : null}
            <Col xs={8} sm={3} md={2}>
              <Form.Select
                onChange={(e) => {
                  updateSelectedBusinessLine(e.target.value);
                  window.location.reload();
                }}
                value={selectedBusinessLineId}
              >
                {businessLines &&
                  businessLines.map((b, i) => {
                    return (
                      <option key={i} value={b.business_line_id}>
                        {b.business_line_name}
                      </option>
                    );
                  })}
              </Form.Select>
            </Col>
            <Col xs={4} sm={3} md={2} className="text-end">
              <Button type="button" variant="link">
                <FontAwesomeIcon icon={faBell} />
              </Button>
              <DropdownButton
                as={ButtonGroup}
                drop="down"
                variant="link"
                title={<FontAwesomeIcon icon={faUser} fixedWidth={true} />}
              >
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => history.push("/profile")}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="2" onClick={() => logout()}>
                  Sign Out
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </header>
        <div id="wrapper" className={toggle === true ? "toggled" : ""}>
          <div id="sidebar-wrapper">
            <nav>{renderLinkList(links)}</nav>
          </div>
          <div id="page-content-wrapper">
            <div id="main-content">{children}</div>
            <footer>
              <Row>
                <Col xs={12} sm={6} md={3}>
                  <p className="m-0">&copy; 2021 Referral Lab, LLC</p>
                  <p className="m-0">Version {moment().format("MM.DD.YYYY")}</p>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  [Info Links]
                </Col>
                <Col xs={12} sm={6} md={3}>
                  [App Links]
                </Col>
                <Col xs={12} sm={6} md={3}>
                  [Support Links]
                </Col>
              </Row>
            </footer>
          </div>
        </div>

        <QuantumModal
          show={isVisible}
          onHide={() => {
            setSearchTerm("");
            close();
          }}
          question={question}
        />
        <ConfirmationModal />
      </Container>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
