import { gql } from "@apollo/client";

const BANK_DETAIL_ITEM_FRAGMENT = gql`
  fragment BankDetail on BankDetailItem {
    id
    attributes {
      id
      name
      value
    }
  }
`;

const BANK_DETAIL_FRAGMENT = gql`
  fragment BankDetail on BankDetailCollection {
    id
    title
    attributes(isHidden: false) {
      id
      name
      value
    }
    pairUnit {
      direction
      currency {
        asset
      }
      paymentSystem {
        name
        tag
      }
    }
  }
`;

export { BANK_DETAIL_ITEM_FRAGMENT,BANK_DETAIL_FRAGMENT };
