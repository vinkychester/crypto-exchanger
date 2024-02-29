import { gql } from "@apollo/client";

const GET_PAYMENT_SYSTEMS = gql`
  query getPaymentSystems {
    paymentSystems {
      id
      name
    }
  }
`;

export {
  GET_PAYMENT_SYSTEMS
};