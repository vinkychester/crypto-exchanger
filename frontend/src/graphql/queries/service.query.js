import { gql } from "@apollo/client";

const GET_SERVICES = gql`
  query getServices {
    services {
      id
      name 
    }
  }
`;

export { GET_SERVICES };