import { gql } from "@apollo/client";

const REVIEW_DETAILS_FRAGMENT = gql`
  fragment ReviewDetails on ReviewCollection {
    id
    message
    createdAt
  }
`;

export {
  REVIEW_DETAILS_FRAGMENT
}