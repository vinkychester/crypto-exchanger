import { gql } from "@apollo/client";

const GET_USER_ACCOUNT_DETAILS = gql`
  query accountDetailsUser($id: ID!) {
    user(id: $id) {
      id
      firstname
      lastname
      email
      googleAuthenticatorSecret
      googleAuthQrCode
    }
  }
`;

export {
  GET_USER_ACCOUNT_DETAILS
};
