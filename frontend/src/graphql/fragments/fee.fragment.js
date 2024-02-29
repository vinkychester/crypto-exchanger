import { gql } from "@apollo/client";

const FEE_PERCENT_FRAGMENT = gql`
  fragment FeePercent on FeeCollection {
    percent
  }
`;

const FEE_PERCENT_ITEM_FRAGMENT = gql`
  fragment FeePercentItem on Fee {
    percent
  }
`;

const FEE_CONSTANT_FRAGMENT = gql`
  fragment FeeConstant on FeeCollection {
    constant
  }
`;

const FEE_CONSTANT_ITEM_FRAGMENT = gql`
  fragment FeeConstantItem on Fee {
    constant
  }
`;

const FEE_DETAILS_FRAGMENT = gql`
  fragment FeeDetails on FeeCollection {
    ...FeePercent
    ...FeeConstant
    max
    min
  }
  ${FEE_PERCENT_FRAGMENT}
  ${FEE_CONSTANT_FRAGMENT}
`;

export {
  FEE_PERCENT_FRAGMENT,
  FEE_PERCENT_ITEM_FRAGMENT,
  FEE_CONSTANT_FRAGMENT,
  FEE_CONSTANT_ITEM_FRAGMENT,
  FEE_DETAILS_FRAGMENT,
};
