import { gql } from "@apollo/client";

const UPDATE_REQUISITION_DETAILS = gql`
  mutation updateRequisitionDetails(
    $id: ID!
    $status: String
    $comment: String
  ) {
    updateRequisition(input: { id: $id, status: $status, comment: $comment }) {
      requisition {
        id
      }
    }
  }
`;

export { UPDATE_REQUISITION_DETAILS };
