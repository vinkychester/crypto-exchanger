import {
  sidebar,
  clients,
  paymentSettings,
  reviews,
  calculator,
  requisition,
  currency,
  cardVerification,
  feedbacks,
  bankDetails,
} from "./rbac-consts";

const isOwner = (userId, ownerId) => {
  if (!userId || !ownerId) return false;
  return userId === ownerId;
};

const rules = {
  client: {
    static: [
      //sidebar rules
      sidebar.REQUISITIONS,
      sidebar.BANK_DETAILS,
      sidebar.ACCOUNT,
      sidebar.CARD_VERIFICATION,
      // reviews page rules
      reviews.CREATE,
      //calculator
      calculator.EXCHANGE,
      // requisitions page rules
      requisition.READ,
      // credit page rules
      cardVerification.CREATE,
      cardVerification.READ,
      cardVerification.DELETE,
      // bank details
      bankDetails.ACTIONS
    ],
    dynamic: {
      [requisition.READ_DETAILS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.ACTIONS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [cardVerification.READ_DETAILS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
    },
  },
  seo: {
    static: [],
    dynamic: {},
  },
  admin: {
    static: [
      //sidebar rules
      sidebar.REQUISITIONS,
      sidebar.CLIENTS,
      sidebar.PAYMENT_SETTINGS,
      sidebar.FEEDBACKS,
      sidebar.REVIEWS,
      sidebar.ACCOUNT,
      sidebar.CARD_VERIFICATION,
      // clients page rules
      clients.READ,
      clients.BAN_ACTIONS,
      clients.READ_DETAILS,
      // paymentSettings page rules
      paymentSettings.READ,
      paymentSettings.CREATE_PAIR,
      // reviews page rules
      reviews.PANEL_READ,
      reviews.EDIT,
      // requisitions page rules
      requisition.READ,
      requisition.READ_DETAILS,
      requisition.CLIENT_DETAILS,
      // currencies page rules
      currency.READ,
      // credit page rules
      cardVerification.READ,
      cardVerification.READ_DETAILS,
      cardVerification.CLIENT_DETAILS,
      cardVerification.ACTIONS,
      cardVerification.FILTER_CLIENT_DETAILS,
      cardVerification.NOTIFICATION,
      //feedbacks
      feedbacks.PANEL_READ,
      feedbacks.DETAILS,
    ],
    dynamic: {},
  },
};

export default rules;
