import { gql } from "@apollo/client";

const UPDATE_DETAILS_ACCOUNT = gql`
  mutation updateUserDetails($id: ID!, $firstname: String!, $lastname: String!) {
    updateUser(input: {id: $id,firstname: $firstname, lastname: $lastname}) {
      user {
        id
      }
    }
  }
`;

export {
  UPDATE_DETAILS_ACCOUNT
};