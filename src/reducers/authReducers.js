import { addReducer } from "reactn";
import moment from "moment-timezone";
import { setCookie } from "../lib/cookies";

const getCookieOpts = () => {
  const base = {
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    secure: !["app.referrallab.local", "localhost"].includes(
      window.location.hostname
    ),
    httpOnly: false,
    path: "/",
  };

  /**
   * On localhost the domain parameter HAS TO BE excluded
   * altogether from the parameters.
   */
  if (window.location.hostname !== "localhost") {
    base.domain = window.location.hostname;
  }

  return base;
};

addReducer("login", (global, dispatch, userObj) => {
  const opts = getCookieOpts();

  let user = { ...userObj };
  let token = userObj._token;
  let businessLines = userObj._businessLines;
  let selectedBusinessLineId =
    user.business_line_id || businessLines[0].business_line_id;
  let accounts = userObj._accounts || null;
  let selectedAccount = {
    value: user.account_id,
    label: user.account_name,
  };

  delete user._token;
  delete user._businessLines;
  delete user._accounts;

  window.localStorage.setItem("user", JSON.stringify(user));
  window.localStorage.setItem("businessLines", JSON.stringify(businessLines));
  window.localStorage.setItem("selectedBusinessLineId", selectedBusinessLineId);
  window.localStorage.setItem("accounts", JSON.stringify(accounts));
  window.localStorage.setItem(
    "selectedAccount",
    JSON.stringify(selectedAccount)
  );
  setCookie("token", userObj._token, opts);

  moment.tz.setDefault(userObj.timezone);

  return {
    ...global,
    user: userObj,
    token,
    businessLines,
    selectedBusinessLineId,
    accounts,
    selectedAccount,
  };
});

addReducer("verified", (global, dispatch, userObj) => {
  const opts = getCookieOpts();

  window.localStorage.setItem("user", { ...userObj }, opts);

  moment.tz.setDefault(userObj.timezone);

  return { ...global, user: userObj, token: userObj._token };
});

addReducer("logout", (global, dispatch) => {
  const opts = getCookieOpts();

  opts.maxAge = 0;

  window.localStorage.clear();
  setCookie("token", null, opts);

  return { ...global, user: null, token: null };
});
