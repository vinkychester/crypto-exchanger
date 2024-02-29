import { gql } from "@apollo/client";

const USER_NAME_DETAILS_COLLECTION_FRAGMENT = gql`
  fragment UserNameDetailsCollection on UserCollection {
    id
    firstname
    lastname
  }
`;

const USER_NAME_DETAILS_ITEM_FRAGMENT = gql`
  fragment UserNameDetails on UserItem {
    id
    firstname
    lastname
  }
`;

const USER_ITEM_FRAGMENT = gql`
  fragment User on UserItem {
    ...UserNameDetails
    email
  }
  ${USER_NAME_DETAILS_ITEM_FRAGMENT}
`;

const USER_COLLECTION_FRAGMENT = gql`
  fragment UserCollection on UserCollection {
    ...UserNameDetailsCollection
    email
  }
  ${USER_NAME_DETAILS_COLLECTION_FRAGMENT}
`;

const USER_DETAILS_COLLECTION_FRAGMENT = gql`
  fragment UserDetailsCollection on UserCollection {
    ...UserCollection
    createdAt
    registrationType
  }
  ${USER_COLLECTION_FRAGMENT}
`;

const USER_DETAILS_ITEM_FRAGMENT = gql`
  fragment UserDetails on UserItem {
    ...User
    createdAt
    registrationType
  }
  ${USER_ITEM_FRAGMENT}
`;

export {
  USER_DETAILS_COLLECTION_FRAGMENT,
  USER_DETAILS_ITEM_FRAGMENT,
  USER_ITEM_FRAGMENT,
  USER_COLLECTION_FRAGMENT,
  USER_NAME_DETAILS_ITEM_FRAGMENT,
  USER_NAME_DETAILS_COLLECTION_FRAGMENT
};
