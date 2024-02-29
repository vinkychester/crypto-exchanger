const requisitionStatusConst = {
  NEW: "NEW",
  // PAYMENT: "PAYMENT",
  INVOICE: "INVOICE",
  PENDING: "PENDING",
  PROCESSED: "PROCESSED",
  FINISHED: "FINISHED",
  CANCELED: "CANCELED",
  DISABLED: "DISABLED",
  // NOT_PAID: "NOT_PAID",
  ERROR: "ERROR",
  CARD_VERIFICATION: "CARD_VERIFICATION",
};

const creditCardStatuses = {
  VERIFIED: "VERIFIED",
  NOT_VERIFIED: "NOT_VERIFIED",
  CANCELED: "CANCELED",
  PAST_DUE_DATE: "PAST_DUE_DATE",
};

const feedbackStatusConst = {
  NOT_VIEWED: "not_viewed",
  VIEWED: "viewed",
  WELL_DONE: "well_done",
  DELETED: "deleted"
};

export { requisitionStatusConst, creditCardStatuses, feedbackStatusConst };
