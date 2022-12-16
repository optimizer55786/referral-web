import React from "reactn";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt } from "@fortawesome/pro-solid-svg-icons";

import "./css/Timeline.css";

const Timeline = ({ items }) => {
  return (
    <div className="timline-container">
      <ul className="cbp_tmtimeline">
        {items.map((item, itemIndex) => {
          const dt = moment(item.date);

          return (
            <li key={itemIndex}>
              <time className="cbp_tmtime" datetime="2013-04-10 18:30">
                <span>{dt.format("M/D/YYYY")}</span>{" "}
                <span>{dt.format("h:mm A")}</span>
              </time>
              <div className="cbp_tmicon cbp_tmicon-phone">
                <FontAwesomeIcon icon={faPhoneAlt} fixedWidth={true} />
              </div>
              <div className="cbp_tmlabel">
                <p>{item.comment}</p>
                <hr />
                <p className="m-0 p-0">
                  {item.userName}{" "}
                  <small style={{ marginLeft: "1rem" }}>
                    {item.businessLine.toUpperCase()} &middot; @LindsayJones
                    {item.mentions && item.mentions.length > 0 ? (
                      <>
                        &middot;{" "}
                        {item.mentions.map((u, uIndex) => (
                          <span key={uIndex} style={{ marginLeft: "1rem" }}>
                            {u.userName}
                          </span>
                        ))}
                      </>
                    ) : null}
                  </small>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
      businessLine: PropTypes.string.isRequired,
    })
  ),
};

export default Timeline;
