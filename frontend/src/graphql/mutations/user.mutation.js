import { gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser(
    $firstname: String!
    $lastname: String!
    $email: String!
    $roles: String!
  ) {
    createUser(
      input: { firstname: $firstname, lastname: $lastname, email: $email, roles: $roles }
    ) {
      user {
        id
      }
    }
  }
`;

const CONFIRM_EMAIL = gql`
  mutation confirmEmail($token: String!) {
    confirmationMutationUser(input: { token: $token }) {
      user {
        id
      } 
    }
  }
`;
const UPDATE_USER_DETAILS = gql`
  mutation updateUser($id: ID!, $isDeleted: Boolean) {
    updateUser(input: { id: $id, isDeleted: $isDeleted }) {
     user {
        id
      }
   }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPasswordMutationUser(input: { email: $email }) {
      user {
        id
      }
    }
  }
`;
const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $token: String!
    $newPassword: String!
    $newRetypedPassword: String!
  ) {
    changePasswordMutationUser(
      input: {
        token: $token
        newPassword: $newPassword
        newRetypedPassword: $newRetypedPassword
      }
    ) {
      user {
        id
      }
    }
  }
`;
const ACCOUNT_CHANGE_PASSWORD = gql`
  mutation accountChangePassword(
    $id: ID!
    $oldPassword: String!
    $newPassword: String!
    $newRetypedPassword: String!
  ) {
    accountChangePasswordMutationUser(
      input: {
        id: $id
        oldPassword: $oldPassword
        newPassword: $newPassword
        newRetypedPassword: $newRetypedPassword
      }
    ) {
      user {
        id
      }
    }
  }
`;
export {
  CREATE_USER,
  CONFIRM_EMAIL,
  UPDATE_USER_DETAILS,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  ACCOUNT_CHANGE_PASSWORD
};