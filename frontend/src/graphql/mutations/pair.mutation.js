import { gql } from "@apollo/client";

const UPDATE_PAIR_DETAILS = gql`
  mutation updatePairDetails($id: ID!, $isActive: Boolean, $percent: Float) {
    updatePair(input: { id: $id, isActive: $isActive, percent: $percent }) {
      pair {
        id
      }
    }
  }
`;

const CREATE_PAIR = gql`
  mutation createPair($percent: Float!, $payment: String!, $payout: String!) {
    createPair(
      input: { percent: $percent, payment: $payment, payout: $payout }
    ) {
      pair {
        id
      }
    }
  }
`;

export { UPDATE_PAIR_DETAILS, CREATE_PAIR };
