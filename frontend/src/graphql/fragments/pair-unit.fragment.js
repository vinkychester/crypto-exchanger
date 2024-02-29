import { gql } from "@apollo/client";

import {
  CURRENCY_ASSET_FRAGMENT,
  CURRENCY_ASSET_COLLECTION_FRAGMENT,
  CURRENCY_ASSET_ITEM_FRAGMENT,
  CURRENCY_DETAILS_FRAGMENT,
  CURRENCY_DETAILS_ITEM_FRAGMENT,
} from "./currency.fragment";
import {
  FEE_CONSTANT_ITEM_FRAGMENT,
  FEE_DETAILS_FRAGMENT,
} from "./fee.fragment";

const PAIR_UNIT_TABS_FRAGMENT = gql`
  fragment Tabs on PairUnitCollection {
    pairUnitTabs {
      id
      name
    }
  }
`;

const PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT = gql`
  fragment PaymentSystem on PairUnitCollection {
    paymentSystem {
      id
      name
      tag
      subName
    }
  }
`;

const PAIR_UNIT_ITEM_PAYMENT_SYSTEM_FRAGMENT = gql`
  fragment PaymentSystemItem on PairUnitItem {
    paymentSystem {
      id
      name
      tag
      subName
    }
  }
`;

const PAIR_UNIT_CURRENCY_WITH_SERVICE_FRAGMENT = gql`
  fragment CurrencyWithService on PairUnitCollection {
    currency {
      id
      ...CurrencyDetails
    }
  }
  ${CURRENCY_DETAILS_FRAGMENT}
`;

const PAIR_UNIT_CURRENCY_WITH_SERVICE_ITEM_FRAGMENT = gql`
  fragment CurrencyWithServiceItem on PairUnitItem {
    currency {
      id
      ...CurrencyDetailsItem
    }
  }
  ${CURRENCY_DETAILS_ITEM_FRAGMENT}
`;

const PAIR_UNIT_CURRENCY_FRAGMENT = gql`
  fragment Currency on PairUnitCollection {
    currency {
      id
      ...CurrencyAsset
    }
  }
  ${CURRENCY_ASSET_COLLECTION_FRAGMENT}
`;

const PAIR_UNIT_ITEM_CURRENCY_FRAGMENT = gql`
  fragment CurrencyItem on PairUnitItem {
    currency {
      id
      ...CurrencyAssetItem
    }
  }
  ${CURRENCY_ASSET_ITEM_FRAGMENT}
`;

const PAIR_UNIT_FEE_FRAGMENT = gql`
  fragment PairUnitFee on PairUnitCollection {
    fee {
      id
      ...FeeDetails
    }
  }
  ${FEE_DETAILS_FRAGMENT}
`;

const PAIR_UNIT_FEE_ITEM_FRAGMENT = gql`
  fragment PairUnitFeeItem on PairUnitItem {
    fee {
      id
      ...FeeConstantItem
    }
  }
  ${FEE_CONSTANT_ITEM_FRAGMENT}
`;

const PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT = gql`
  fragment PairUnitWithServiceDetails on PairUnitCollection {
    id
    direction
    ...CurrencyWithService
    ...PaymentSystem
  }
  ${PAIR_UNIT_CURRENCY_WITH_SERVICE_FRAGMENT}
  ${PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT}
`;

const PAIR_UNIT_WITH_SERVICE_DETAILS_ITEM_FRAGMENT = gql`
  fragment PairUnitWithServiceDetailsItem on PairUnitItem {
    id
    direction
    ...CurrencyWithServiceItem
    ...PaymentSystemItem
  }
  ${PAIR_UNIT_CURRENCY_WITH_SERVICE_ITEM_FRAGMENT}
  ${PAIR_UNIT_ITEM_PAYMENT_SYSTEM_FRAGMENT}
`;

const PAIR_UNIT_DETAILS_FRAGMENT = gql`
  fragment PairUnitDetails on PairUnitCollection {
    id
    direction
    ...Currency
    ...PaymentSystem
  }
  ${PAIR_UNIT_CURRENCY_FRAGMENT}
  ${PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT}
`;

const PAIR_UNIT_ITEM_DETAILS_FRAGMENT = gql`
  fragment PairUnitItemDetails on PairUnitItem {
    id
    direction
    ...CurrencyItem
    ...PaymentSystemItem
  }
  ${PAIR_UNIT_ITEM_CURRENCY_FRAGMENT}
  ${PAIR_UNIT_ITEM_PAYMENT_SYSTEM_FRAGMENT}
`;

const PAIR_UNIT_COMMISSION_FRAGMENT = gql`
  fragment PairUnitCommission on PairUnit {
    amount
    min
    max
    fee {
      id
      ...FeeConstantItem
    }
    currency {
      id
      ...CurrencyAssetItem
    }
  }
  ${FEE_CONSTANT_ITEM_FRAGMENT}
  ${CURRENCY_ASSET_FRAGMENT}
`;

export {
  PAIR_UNIT_DETAILS_FRAGMENT,
  PAIR_UNIT_TABS_FRAGMENT,
  PAIR_UNIT_CURRENCY_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT,
  PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT,
  PAIR_UNIT_COMMISSION_FRAGMENT,
  PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT,
  PAIR_UNIT_ITEM_DETAILS_FRAGMENT,
  PAIR_UNIT_WITH_SERVICE_DETAILS_ITEM_FRAGMENT,
  PAIR_UNIT_FEE_ITEM_FRAGMENT,
};
