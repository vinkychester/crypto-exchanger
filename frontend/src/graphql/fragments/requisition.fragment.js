import { gql } from "@apollo/client";
import { BANK_DETAIL_ITEM_FRAGMENT } from "./bank-detail.fragment";

import { PAIR_COLLECTION_FRAGMENT, PAIR_ITEM_FRAGMENT } from "./pair.fragment";
import { USER_COLLECTION_FRAGMENT, USER_ITEM_FRAGMENT } from "./user.fragment";

const REQUISITION_CLIENT_FRAGMENT = gql`
  fragment RequisitionClient on RequisitionCollection {
    client {
      ...UserCollection
      #   verificationInfo
    }
  }
  ${USER_COLLECTION_FRAGMENT}
`;

const REQUISITION_ITEM_CLIENT_FRAGMENT = gql`
  fragment RequisitionItemClient on RequisitionItem {
    client {
      ...User
      #   verificationInfo
    }
  }
  ${USER_ITEM_FRAGMENT}
`;

const REQUISITION_ITEM_DETAILS_FRAGMENT = gql`
  fragment RequisitionItemDetails on RequisitionItem {
    id
    createdAt
    paymentAmount
    payoutAmount
    status
    course
    systemProfit
    invoices {
      id
      status
      direction
    }
    requisitionFees {
      id
      percent
      constant
      rate
      pairPercent
      paymentSystemPrice
      type
    }
    bankDetails {
      collection {
        ...BankDetail
      }
    }
    pair {
      ...Pair
    }
    ...RequisitionItemClient  
  }
  ${BANK_DETAIL_ITEM_FRAGMENT}
  ${REQUISITION_ITEM_CLIENT_FRAGMENT}
  ${PAIR_ITEM_FRAGMENT}
`;

const REQUISITION_DETAILS_FRAGMENT = gql`
  fragment RequisitionDetails on RequisitionCollection {
    id
    createdAt
    paymentAmount
    payoutAmount
    status
    pair {
      ...PairCollection
    }
    ...RequisitionClient
  }
  ${PAIR_COLLECTION_FRAGMENT}
  ${REQUISITION_CLIENT_FRAGMENT}
`;

export { REQUISITION_DETAILS_FRAGMENT, REQUISITION_ITEM_DETAILS_FRAGMENT };
