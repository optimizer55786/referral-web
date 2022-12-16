import { setGlobal } from "reactn";
import { getCookie } from "./lib/cookies";

import referralSourcesGridProps from "./components/referralSources/referralSourcesGridProps";
import referralsGridProps from "./components/referrals/referralsGridProps";

const getJsonItem = (key) => {
  const val = window.localStorage.getItem(key);
  if (!val) {
    return null;
  }
  return JSON.parse(val);
};

export async function init() {
  try {
    let user = window.localStorage.getItem("user");
    let toggle = window.localStorage.getItem("toggle");
    if (user) {
      user = JSON.parse(user);
    }
    let referralSourcesView = window.localStorage.getItem("referralSourcesView");
    if (referralSourcesView) {
      referralSourcesView = JSON.parse(referralSourcesView);
    } else {
      referralSourcesView = referralSourcesGridProps.columns.map((column)=>{return {key:column.key, visible:true}})
    }
    let referralsView = window.localStorage.getItem("referralsView");
    if (referralsView) {
      referralsView = JSON.parse(referralsView);
    } else {
      referralsView = referralsGridProps.columns.map((column)=>{return {key:column.key, visible:true}})
    }

    setGlobal({
      user: getJsonItem("user"),
      token: getCookie("token") || null,

      businessLines: getJsonItem("businessLines"),
      selectedBusinessLineId: window.localStorage.getItem(
        "selectedBusinessLineId"
      ),

      accounts: getJsonItem("accounts"),
      selectedAccount: getJsonItem("selectedAccount"),

      toggle: toggle === "true" || toggle === null,

      quantumShowModal: false,
      quantumQuestion: "",

      referralSourcesView: referralSourcesView,
      referralsView: referralsView,


      confirmModal: {
        show: false,
        question: "Unknown",
        asyncUrl: null,
        asyncMethod: "put",
        asyncPayload: null,
        confirmButtonLabel: "Continue",
        confirmButtonVariant: "primary",
        declineButtonLabel: "Cancel",
        declineButtonVariant: "link",
        onConfirm: () => {},
        onCancel: () => {},
      },
    });
  } catch (err) {
    console.log(err);
  }
}
