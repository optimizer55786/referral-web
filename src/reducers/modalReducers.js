import { addReducer } from "reactn";

addReducer("confirmation", (global, dispatch, opts) => {
  return {
    ...global,
    confirmModal: { ...global.confirmModal, ...opts, show: true },
  };
});

addReducer("closeConfirmation", (global, dispatch) => {
  const defaultVals = {
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
  };
  return { ...global, confirmModal: { ...defaultVals } };
});
