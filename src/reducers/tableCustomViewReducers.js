import { addReducer } from "reactn";

addReducer("updateReferralSourcesView", (global, reducer, data) => {
  window.localStorage.setItem(
    "referralSourcesView",
    JSON.stringify(data)
  );
  return { ...global, referralSourcesView: data };
});

addReducer("updateReferralsView", (global, reducer, data) => {
  window.localStorage.setItem(
    "referralsView",
    JSON.stringify(data)
  );
  return { ...global, referralsView: data };
});

addReducer("updateLeadsView", (global, reducer, data) => {
  window.localStorage.setItem(
    "leadsView",
    data
  );
  return { ...global, leadsView: data };
});
