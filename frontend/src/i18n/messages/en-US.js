import { locales } from "../locales";
import { creditCardStatuses, requisitionStatusConst } from "../../utils/consts.util";

export default {
  [locales.ENGLISH]: {
    cardNumber: "Card number",
    wallet: "Wallet",
    email: "E-mail",
    expiryMonth: "Month",
    expiryYear: "Year",
    cardHolder: "First Name and Last Name",
    cardHolderCountry: "Country",
    cardHolderCity: "City",
    cardHolderDOB: "Date of birth",
    cityId: "City",
    internal: "Internal network",
    external: "External network",
    networkId: "Network",
    address: "Point address",
    name: "Point name",
    description: "Description of the point",
    cashierId: "Point manager",
    exchangePointId: "Point",
    referenceId: "Order ID",
    contacts: "Additional Information",

    [requisitionStatusConst.NEW]: "New order",
    [requisitionStatusConst.INVOICE]: "Awaiting payment",
    [requisitionStatusConst.PENDING]: "In processing",
    [requisitionStatusConst.PROCESSED]: "Paid out",
    [requisitionStatusConst.FINISHED]: "Done",
    [requisitionStatusConst.CANCELED]: "Canceled",
    [requisitionStatusConst.DISABLED]: "Closed",
    [requisitionStatusConst.ERROR]: "Transaction error",
    [requisitionStatusConst.CARD_VERIFICATION]: "Card verification",

    [creditCardStatuses.VERIFIED]: "Verified",
    [creditCardStatuses.NOT_VERIFIED]: "Awaiting verification",
    [creditCardStatuses.CANCELED]: "Canceled",
    [creditCardStatuses.PAST_DUE_DATE]: "Expired",
  },
};
