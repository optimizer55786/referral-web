import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import ContentBlock from "./ContentBlock";

// add the keys to the list
const createTabList = (list) => {
  return list.map((item) => {
    return {
      key: item.label
        .replace(/[^\w]/g, "-")
        .replace(/-{2,}/g, "-")
        .toLowerCase(),
      ...item,
    };
  });
};

const StyledDiv = styled.div``;

const Tabs = ({ tabs, style, contentBlock = true }) => {
  const [tabList, setTabList] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation();

  const getActiveTabFromLocation = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }

    let loc = location.hash || "";
    if (loc === "") {
      return list[0];
    }
    loc = loc.replace(/^#/, "");

    const act = list.find((t) => t.key === loc);
    if (!act) {
      return list[0];
    }

    return act;
  };

  useEffect(() => {
    if (tabs) {
      const newList = createTabList(tabs);
      setTabList(newList);
      setActiveTab(newList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  useEffect(() => {
    const newActiveTab = getActiveTabFromLocation(tabList);
    if (newActiveTab !== null) {
      setActiveTab(newActiveTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!tabList) {
    return null;
  }

  const Wrapper = contentBlock ? ContentBlock : StyledDiv;

  return (
    <Wrapper
      className="mb-3"
      fullHeight={false}
      styles={style ? { ...style } : {}}
    >
      {tabList.map((tab, i) => {
        return (
          <Link
            key={i}
            className={
              activeTab && activeTab.key === tab.key
                ? "btn btn-primary"
                : "btn btn-link"
            }
            style={{ marginRight: "0.5rem" }}
            to={`#${tab.key}`}
          >
            {tab.label}
          </Link>
        );
      })}
      <hr />
      <div className="mt-3">{activeTab.content}</div>
    </Wrapper>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
};

export default Tabs;
