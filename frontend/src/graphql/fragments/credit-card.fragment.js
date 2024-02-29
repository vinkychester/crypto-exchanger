import { gql } from "@apollo/client";

import { USER_COLLECTION_FRAGMENT, USER_ITEM_FRAGMENT } from "./user.fragment";

const CREDIT_DETAILS_ITEM_FRAGMENT = gql`
  fragment CreditDetailsItem on CreditCardItem {
    id
    cardNumber
    cardMask
    expiryDate
    status
    createdAt
    client {
      ...User
    }
  }
  ${USER_ITEM_FRAGMENT}
`;

const CREDIT_DETAILS_FRAGMENT = gql`
  fragment CreditDetails on CreditCardCollection {
    id
    cardNumber
    cardMask
    expiryDate
    status
    createdAt
    client {
      ...UserCollection
    }
  }
  ${USER_COLLECTION_FRAGMENT}
`;

export { CREDIT_DETAILS_ITEM_FRAGMENT, CREDIT_DETAILS_FRAGMENT };
