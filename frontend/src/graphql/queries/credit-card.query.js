import { gql } from "@apollo/client";

import {
  CREDIT_DETAILS_FRAGMENT,
  CREDIT_DETAILS_ITEM_FRAGMENT,
} from "../fragments/credit-card.fragment";

const GET_CREDIT_CARDS = gql`
  query GetCreditCards(
    $page: Int!
    $itemsPerPage: Int!
    $cardMask: String
    $status: String
    $date_gte: String
    $date_lte: String
    $firstname: String
    $lastname: String
    $client_id: String
  ) {
    creditCards(
      page: $page
      itemsPerPage: $itemsPerPage
      cardMask: $cardMask
      status: $status
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      client_firstname: $firstname
      client_lastname: $lastname
      client_id: $client_id
    ) {
      collection {
        ...CreditDetails
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${CREDIT_DETAILS_FRAGMENT}
`;

const GET_CREDIT_CARD_DETAILS = gql`
  query getCreditCardDetails($id: ID!) {
    creditCard(id: $id) {
      mediaObjects {
        id
        base64
      }
      ...CreditDetailsItem
    }
  }
  ${CREDIT_DETAILS_ITEM_FRAGMENT}
`;

export { GET_CREDIT_CARDS, GET_CREDIT_CARD_DETAILS };
