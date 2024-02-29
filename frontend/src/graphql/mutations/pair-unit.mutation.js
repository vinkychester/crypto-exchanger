import { gql } from "@apollo/client";

const UPDATE_PAIR_UNIT_DETAILS = gql`
  mutation updatePairUnitDetails(
    $id: ID!
    $pairUnitTabs: String
    $isActive: Boolean
    $isCardVerification: Boolean
    $priority: Int
    $price: Float
  ) {
    updatePairUnit(
      input: {
        id: $id
        pairUnitTabs: $pairUnitTabs
        isActive: $isActive
        isCardVerification: $isCardVerification
        priority: $priority
        price: $price
      }
    ) {
      pairUnit {
        id
      }
    }
  }
`;
export {
  UPDATE_PAIR_UNIT_DETAILS
};