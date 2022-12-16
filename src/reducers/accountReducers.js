import { addReducer } from "reactn";

addReducer("updateSelectedAccount", (global, reducer, accountSelectVal) => {
  window.localStorage.setItem(
    "selectedAccount",
    JSON.stringify(accountSelectVal)
  );
  return { ...global, selectedAccount: accountSelectVal };
});
