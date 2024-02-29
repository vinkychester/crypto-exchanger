import { gql } from "@apollo/client";

import { PAIR_UNIT_COMMISSION_FRAGMENT } from "../fragments/pair-unit.fragment";
import { PAIR_DETAILS_FRAGMENT } from "../fragments/pair.fragment";

const GET_CALCULATED_DETAILS_WITH_COMMISSION = gql`
  query GetCalcuatedDetails(
    $id: ID!
    $includePayment: Boolean!
    $includePayout: Boolean!
  ) {
    calculationQueryPair(id: $id) {
      _id
      payment @include(if: $includePayment) {
        _id
        ...PairUnitCommission
      }
      payout @include(if: $includePayout) {
        _id
        ...PairUnitCommission
      }
    }
  }
  ${PAIR_UNIT_COMMISSION_FRAGMENT}
`;

const GET_CALCULATED_DETAILS = gql`
  query GetCalcuatedDetails(
    $id: ID!
    $includePayment: Boolean!
    $includePayout: Boolean!
    $direction: String
    $amount: Float
  ) {
    calculationQueryPair(id: $id, direction: $direction, amount: $amount) {
      _id
      payment @include(if: $includePayment) {
        _id
        amount
      }
      payout @include(if: $includePayout) {
        _id
        amount
      }
    }
  }
`;

const GET_ALL_PAIRS_WITH_IS_REQUISITION = gql`
  query getAllPairsWithIsRequisition(
    $page: Int = 1
    $itemsPerPage: Int
    $active: Boolean
    $payment_system_in: String
    $payment_system_out: String
    $currency_in: String
    $currency_out: String
    $percent_gte: String
    $percent_lte: String
    $service_in: String
    $service_out: String
  ) {
    pairs(
      page: $page
      itemsPerPage: $itemsPerPage
      isActive: $active
      payment_paymentSystem_name: $payment_system_in
      payout_paymentSystem_name: $payment_system_out
      payment_currency_asset: $currency_in
      payout_currency_asset: $currency_out
      percent: { gte: $percent_gte, lte: $percent_lte }
      payment_currency_service_tag: $service_in
      payout_currency_service_tag: $service_out
    ) {
      collection {
        id
        ...PairDetails
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${PAIR_DETAILS_FRAGMENT}
`;

export {
  GET_ALL_PAIRS_WITH_IS_REQUISITION,
  GET_CALCULATED_DETAILS,
  GET_CALCULATED_DETAILS_WITH_COMMISSION,
};
