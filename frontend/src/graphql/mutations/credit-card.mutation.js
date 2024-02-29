import { gql } from "@apollo/client";

const CREATE_CREDIT_CARD = gql`
  mutation CreateCreditCard(
    $cardNumber: String!
    $cardMask: String!
    $expiryDate: String!
    $client: String!
    $files: Iterable!
  ) {
    createCreditCard(
      input: {
        cardNumber: $cardNumber
        cardMask: $cardMask
        expiryDate: $expiryDate
        client: $client
        files: $files
      }
    ) {
      creditCard {
        id
      }
    }
  }
`;

const UPDATE_CREDIT_CARD_DATA = gql`
  mutation UpdateCreditCardData($id: ID!, $status: String, $comment: String) {
    updateCreditCard(input: { id: $id, status: $status, comment: $comment }) {
      creditCard {
        id
      }
    }
  }
`;

const DELETE_CREDIT_CARD = gql`
  mutation DeleteCreditCard($id: ID!) {
    deleteCreditCard(input: { id: $id }) {
      creditCard {
        id
      }
    }
  }
`;

export { CREATE_CREDIT_CARD, UPDATE_CREDIT_CARD_DATA, DELETE_CREDIT_CARD };
