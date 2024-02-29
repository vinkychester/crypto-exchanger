import { gql } from "@apollo/client";

const SERVICE_FRAGMENT = gql`
  fragment Service on ServiceCollection {
    id
    percent
    constant
    max
    min
  }
`;

export { FEE_FRAGMENT };