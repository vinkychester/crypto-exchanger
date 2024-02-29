import { gql } from "@apollo/client";

const CREATE_REQUISITION = gql`
  mutation createRequisition(
    $pair: String!
    $paymentAmount: Float!
    $payoutAmount: Float!
    $client: String!
    $paymentAttributes: Iterable!
    $payoutAttributes: Iterable!
    $savePaymentBankDetails: Boolean!
    $savePayoutBankDetails: Boolean!
  ) {
    createRequisition(
      input: {
        pair: $pair
        paymentAmount: $paymentAmount
        payoutAmount: $payoutAmount
        client: $client
        paymentAttributes: $paymentAttributes
        payoutAttributes: $payoutAttributes
        savePaymentBankDetails: $savePaymentBankDetails
        savePayoutBankDetails: $savePayoutBankDetails
      }
    ) {
      requisition {
        id
      }
    }
  }
`;

const UPDATE_REQUISITION_STATUS = gql`
  mutation updateRequisitionStatus($id: ID!, $status: String!) {
    updateRequisition(input: { id: $id, status: $status }) {
      requisition {
        id
        status
      }
    }
  }
`;

export {
  CREATE_REQUISITION,
  UPDATE_REQUISITION_STATUS
};
