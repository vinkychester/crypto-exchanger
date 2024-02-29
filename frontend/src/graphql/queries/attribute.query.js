import { gql } from "@apollo/client";

const GET_ATTRIBUTES = gql`
  query getAttributes(
    $pairUnit_id: Int!
    $direction: String!
    $locale: String!
  ) {
    collectionQueryAttributes(
      pairUnit_id: $pairUnit_id
      direction: $direction
      locale: $locale
    ) {
      id
      name
      direction
      fieldType
      title
    }
  }
`;

export { GET_ATTRIBUTES };