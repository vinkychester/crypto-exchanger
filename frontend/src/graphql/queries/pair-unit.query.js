import { gql } from "@apollo/client";

import {
  PAIR_UNIT_DETAILS_FRAGMENT,
  PAIR_UNIT_TABS_FRAGMENT,
  PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT,
  PAIR_UNIT_FEE_FRAGMENT,
} from "../fragments/pair-unit.fragment";

const GET_ACTIVE_PAIR_UNITS_BY_DIRECTION = gql`
  query GetActivePairUnitsByDirection(
    $direction: String!
    $includePayment: Boolean!
    $includePayout: Boolean!
  ) {
    pairUnits(
      exists: { pairUnitTabs: true }
      direction: $direction
      isActive: true
    ) {
      collection {
        ...PairUnitDetails
        ...Tabs
        paymentPairs(isActive: true) @include(if: $includePayment) {
          collection {
            id
          }
        }
        payoutPairs(isActive: true) @include(if: $includePayout) {
          collection {
            id
          }
        }
      }
    }
  }
  ${PAIR_UNIT_DETAILS_FRAGMENT}
  ${PAIR_UNIT_TABS_FRAGMENT}
`;

const GET_ACTIVE_PAIR_UNITS = gql`
  query getActivePairUnits {
    pairUnits(
      isActive: true
      exists: { pairUnitTabs: true }
      itemsPerPage: 150
    ) {
      collection {
        id
        ...PairUnitWithServiceDetails
      }
    }
  }
  ${PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT}
`;

const GET_ONLY_ACTIVE_PAIR_UNITS = gql`
  query getActivePairUnits {
    pairUnits(isActive: true) {
      collection {
        id
        ...PairUnitWithServiceDetails
      }
    }
  }
  ${PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT}
`;

const GET_PAIR_UNITS_LIST = gql`
  query getPairUnitsList(
    $page: Int = 1
    $itemsPerPage: Int
    $active: Boolean
    $currency: String
    $direction: String
    $payment_system: String
    $service: String
    $percent_gte: String
    $percent_lte: String
    $constant_gte: String
    $constant_lte: String
    $min_gte: String
    $min_lte: String
    $max_gte: String
    $max_lte: String
    $priority_gte: String
    $priority_lte: String
    $payment_tab: Int
  ) {
    pairUnits(
      page: $page
      itemsPerPage: $itemsPerPage
      isActive: $active
      currency_asset: $currency
      direction: $direction
      paymentSystem_name: $payment_system
      currency_service_name: $service
      fee_percent: { gte: $percent_gte, lte: $percent_lte }
      fee_constant: { gte: $constant_gte, lte: $constant_lte }
      fee_min: { gte: $min_gte, lte: $min_lte }
      fee_max: { gte: $max_gte, lte: $max_lte }
      priority: { gte: $priority_gte, lte: $priority_lte }
      pairUnitTabs_id: $payment_tab
    ) {
      collection {
        isActive
        isCardVerification
        balance
        priority
        price
        ...PairUnitWithServiceDetails
        ...Tabs
        ...PairUnitFee
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT}
  ${PAIR_UNIT_TABS_FRAGMENT}
  ${PAIR_UNIT_FEE_FRAGMENT}
`;

const GET_FIAT_RATES_PAIR_UNIT = gql`
  query GetFiatRatesPairUnit {
    pairUnits(
      currency_tag: "CURRENCY"
      exists: { pairUnitTabs: true }
      isActive: true # direction: "payout"
    ) {
      collection {
        balance
        ...PairUnitFee
        ...PairUnitWithServiceDetails
      }
    }
  }
  ${PAIR_UNIT_WITH_SERVICE_DETAILS_FRAGMENT}
  ${PAIR_UNIT_FEE_FRAGMENT}
`;

const GET_CRYPTO_RATES_PAIR_UNIT = gql`
  query GetCryptoRatesPairUnit($selected: Int!) {
    cryptoCollectionPairUnits(
      currency_tag: "CRYPTO"
      exists: { pairUnitTabs: true }
      isActive: true
      selected: $selected
    ) {
      collection {
        id
        surcharge
        direction
        isRateExchange
        price 
        exchangeRate
        currency {
          id
          tag
          asset
          service {
            id
            tag
            name
          }
        }
        paymentSystem {
          id
          tag
          name
          subName
        }
        fee {
          id
          constant
        }
      }
    }
  }
`;

export {
  GET_PAIR_UNITS_LIST,
  GET_ACTIVE_PAIR_UNITS_BY_DIRECTION,
  GET_ACTIVE_PAIR_UNITS,
  GET_FIAT_RATES_PAIR_UNIT,
  GET_CRYPTO_RATES_PAIR_UNIT,
  GET_ONLY_ACTIVE_PAIR_UNITS
};
