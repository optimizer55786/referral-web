import { getGlobal } from "reactn";

export const getBusinessLineById = (businessLineId) => {
  const businessLines = getGlobal().businessLines;
  const bl = businessLines.find((b) => b.business_line_id === businessLineId);
  return bl || null;
};

export const getBusinessLines = () => {
  const businessLines = getGlobal().businessLines;
  return businessLines || null;
};
