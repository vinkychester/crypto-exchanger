const sidebar = {
  REQUISITIONS: "requisitions:sidebar",
  PAYMENT_SETTINGS: "payment-settings:sidebar",
  CLIENTS: "clients:sidebar",
  BANK_DETAILS: "bank-details:sidebar",
  CARD_VERIFICATION: "card-verification:sidebar",
  REVIEWS: "reviews:sidebar",
  FEEDBACKS: "feedbacks:sidebar",
  ACCOUNT: "account:sidebar"
};

const clients = {
  READ: "clients:list",
  READ_DETAILS: "clients-details:list",
  BAN_ACTIONS: "client:ban-actions",
};

const paymentSettings = {
  READ: "paymentSettings:list",
  CREATE_PAIR: "paymentSettings:create-pair",
};

const reviews = {
  PANEL_READ: "review:list",
  EDIT: "review:edit",
  CREATE: "review:create",
};

const calculator = {
  EXCHANGE: "calculator:exchange",
};

const requisition = {
  READ: "requisitions:list",
  READ_DETAILS: "requisitions:details",
  CLIENT_DETAILS: "requisitions:client-details",
  ACTIONS: "requisitions:actions",
};

const feedbacks = {
  PANEL_READ: "feedbacks:list",
  DETAILS: "feedback:details",
};

const currency = {
  READ: "currencies:list",
};

const cardVerification = {
  CREATE: "card-verification:create",
  READ: "card-verification:list",
  READ_DETAILS: "card-verification:details",
  CLIENT_DETAILS: "card-verification:client-details",
  ACTIONS: "card-verification:actions",
  DELETE: "card-verification:delete",
  FILTER_CLIENT_DETAILS: "card-verification:filter-client-details",
  NOTIFICATION: "card-verification:notification",
};

const bankDetails = {
  ACTIONS: "bank-details:actions",
};

const account = {
  READ: "account:read",
};

export {
  sidebar,
  clients,
  paymentSettings,
  reviews,
  calculator,
  feedbacks,
  requisition,
  currency,
  cardVerification,
  bankDetails,
  account
};
