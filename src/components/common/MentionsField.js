import React from "reactn";
import { MentionsInput, Mention } from "react-mentions";
import { makeRequest } from "../../hooks/useApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/pro-solid-svg-icons";

const MentionsField = ({
  referralSourceId = null,
  singleLine = false,
  required = false,
  onUserAdd,
  onReferralSourceAdd,
  handleChange,
  value,
}) => {
  const classNames = {
    mentions__input: "form-control",
    mentions__suggestions__list: "list-group",
    mentions__suggestions__item: "list-group-item list-group-item-action",
    "mentions__suggestions__item--focused": "list-group-item active",
  };
  const styles = {
    "&multiLine": {
      control: {
        minHeight: 80,
      },
      input: {
        padding: 0,
      },
    },
    "&singleLine": {
      input: {
        padding: 0,
      },
    },
  };
  return (
    <>
      <MentionsInput
        value={value}
        onChange={handleChange}
        classNames={classNames}
        singleLine={singleLine}
        style={styles}
        required={required}
      >
        <Mention
          trigger="@"
          data={async (query, callback) => {
            let res = await makeRequest("get", "/users/search");
            let userData = res.rows.map(({ user_id, name }) => ({
              id: user_id,
              display: name,
            }));
            callback(userData);
          }}
          appendSpaceOnAdd={true}
          markup={`@[__display__](${window.location.origin}/community/people/__id__)`}
          onAdd={onUserAdd}
          style={{ backgroundColor: "lightgray" }}
          displayTransform={(id, user) => `@${user}`}
        />
        <Mention
          trigger="#"
          data={async (query, callback) => {
            let res = await makeRequest("get", "/referral-sources");
            let referralourceData = res.rows.map(
              ({ referral_source_id, referral_source_name }) => ({
                id: referral_source_id,
                display: referral_source_name,
              })
            );
            callback(referralourceData);
          }}
          appendSpaceOnAdd={true}
          markup={`@[__display__](${window.location.origin}/referral-sources/__id__)`}
          onAdd={onReferralSourceAdd}
          style={{ backgroundColor: "lightgray" }}
          displayTransform={(id, referral) => `#${referral}`}
        />
      </MentionsInput>
      <p className="mt-2 mb-2">
        <FontAwesomeIcon icon={faQuestionCircle} /> Use @ to tag another user
        and # to tag a referral source.
      </p>
    </>
  );
};

export default MentionsField;
