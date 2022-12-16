import React from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Markdown from "markdown-to-jsx";

const LinkTag = ({ title, href, children }) => {
  return (
    <Link to={href} title={title}>
      {children}
    </Link>
  );
};

const MarkdownLabel = ({ content }) => {
  const convertLinks = (str) => {
    let matches = [...str.matchAll(/\[((?:#|@)[^\]]+)\]\(([^\)]+)\)/gi)];

    if (!matches || matches.length === 0) {
      return str;
    }

    matches.forEach((m) => {
      const url =
        m[1].substring(0, 1) === "@"
          ? `/community/people/${m[2]}`
          : `/referral-sources/${m[2]}`;
      str = str.replace(m[0], `[${m[1]}](${url})`);
    });

    return str;
  };

  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: LinkTag,
          },
        },
      }}
    >
      {convertLinks(content)}
    </Markdown>
  );
};

MarkdownLabel.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownLabel;
