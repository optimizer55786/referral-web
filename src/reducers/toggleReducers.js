import { addReducer } from "reactn";

addReducer("updateToggle", (global, reducer, toggle) => {
  window.localStorage.setItem(
    "toggle",
    toggle
  );
  return { ...global, toggle: toggle };
});
