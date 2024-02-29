import { gql } from "@apollo/client";

const PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT = gql`
  fragment PaymentSystem on PairUnitCollection {
    paymentSystem {
      id
      name
      tag
      subName
    }
  }
`;

export {PAIR_UNIT_PAYMENT_SYSTEM_FRAGMENT};