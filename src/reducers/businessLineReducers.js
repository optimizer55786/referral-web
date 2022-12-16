import { addReducer } from "reactn";

addReducer("updateSelectedBusinessLine", (global, reducer, businessLineId) => {
  window.localStorage.setItem("selectedBusinessLineId", businessLineId);
  return { ...global, selectedBusinessLineId: businessLineId };
});

addReducer("updateBusinessLines", (global, reducer, businessLines) => {
  window.localStorage.setItem("businessLines", JSON.stringify(businessLines));
  return { ...global, businessLines };
});
