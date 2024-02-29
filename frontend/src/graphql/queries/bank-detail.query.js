import { gql } from "@apollo/client";
import { BANK_DETAIL_FRAGMENT } from "../fragments/bank-detail.fragment";

const GET_CLIENT_BANK_DETAILS_BY_DIRECTION = gql`
  query GetClientBankDetailsByDirection(
    $client_id: String!
    $direction: String!
    $pairUnit_id: Int!
  ) {
    bankDetails(
      client_id: $client_id
      direction: $direction
      pairUnit_id: $pairUnit_id
    ) {
      collection {
        id
        title
        attributes(isHidden: false) {
          id
          name
          value
          isHidden
          information
        }
      }
    }
  }
`;

const GET_CLIENT_BANK_DETAILS = gql`
  query getClientBankDetails(
    $page: Int!
    $itemsPerPage: Int!
    $client_id: String!
    $payment_system: String
    $title: String
    $currency: String
    $direction: String
    $value: String
  ) {
    bankDetails(
      page: $page
      itemsPerPage: $itemsPerPage
      client_id: $client_id
      pairUnit_paymentSystem_name: $payment_system
      title: $title
      pairUnit_currency_asset: $currency
      direction: $direction
      attributes_value: $value
    ) {
      collection {
        ...BankDetail
      }
      paginationInfo {
        totalCount
        lastPage
      }
    }
  }
  ${BANK_DETAIL_FRAGMENT}
`;

export { GET_CLIENT_BANK_DETAILS_BY_DIRECTION, GET_CLIENT_BANK_DETAILS };
