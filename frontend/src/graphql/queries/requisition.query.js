import { gql } from "@apollo/client";

import { REQUISITION_DETAILS_FRAGMENT, REQUISITION_ITEM_DETAILS_FRAGMENT } from "../fragments/requisition.fragment";

const GET_REQUISITION_LIST = gql`
  query GetRequisitionList(
    $id: String
    $client_id: String
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $status: [String]
    $payment_system: String
    # $date_gte: String
    # $date_lte: String
    $payment_amount_gte: String
    $payment_amount_lte: String
    $payout_amount_gte: String
    $payout_amount_lte: String
    $wallet: String
  ) {
    requisitions(
      id: $id
      itemsPerPage: $itemsPerPage
      client_id: $client_id
      page: $page
      # createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
      status_list: $status
      pair_payment_paymentSystem_name: $payment_system
      client_firstname: $firstname
      client_lastname: $lastname
      client_email: $email
      paymentAmount: { gte: $payment_amount_gte, lte: $payment_amount_lte }
      payoutAmount: { gte: $payout_amount_gte, lte: $payout_amount_lte }
      bankDetails_attributes_value: $wallet
    ) {
      collection {
        ...RequisitionDetails
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${REQUISITION_DETAILS_FRAGMENT}
`;

const GET_REQUISITION_DETAILS = gql`
  query GetRequisitionDetails($id: ID!) {
    requisition(id: $id) {
      ...RequisitionItemDetails
    }
  }
  ${REQUISITION_ITEM_DETAILS_FRAGMENT}
`;

export { GET_REQUISITION_LIST, GET_REQUISITION_DETAILS };
