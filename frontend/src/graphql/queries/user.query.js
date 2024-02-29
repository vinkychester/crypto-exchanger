import { gql } from "@apollo/client";

import { USER_DETAILS_COLLECTION_FRAGMENT, USER_DETAILS_ITEM_FRAGMENT } from "../fragments/user.fragment";


const GET_USER_CACHE_DETAILS = gql`
  query GetUserCacheDetails {
    userId @client
    userRole @client
    username @client
    isLoggedIn @client
  }
`;

const GET_USER_LIST_BY_ROLE = gql`
  query GetUserListByRole($roles: String!, $page: Int!, $itemsPerPage: Int!, $firstname: String, $lastname: String, $email: String) {
    users(roles: $roles, page: $page, itemsPerPage: $itemsPerPage, firstname: $firstname, lastname: $lastname, email: $email) {
      collection {
        ...UserDetailsCollection
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${USER_DETAILS_COLLECTION_FRAGMENT}
`;

const GET_USER_DETAILS = gql`
  query GetUserDetails($id: ID!) {
    user(id: $id) {
      ...UserDetails
    }
  }
  ${USER_DETAILS_ITEM_FRAGMENT}
`;

const SET_AUTHENTICATOR_SECRET = gql`
  mutation updateClient($id: ID!, $secret: String!, $QR: String!) {
    updateClient(
      input: {
        id: $id
        googleAuthenticatorSecret: $secret
        googleAuthQrCode: $QR
      }
    ) {
      client {
        id
      }
    }
  }
`;

export {
  GET_USER_CACHE_DETAILS,
  GET_USER_LIST_BY_ROLE,
  GET_USER_DETAILS,
  SET_AUTHENTICATOR_SECRET
};