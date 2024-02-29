import { gql } from "@apollo/client";

const GET_ALL_FEEDBACK_MESSAGE = gql`
  query getAllFeedbackMessage(
    $page: Int
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $email: String
    $status: String
    $deleted: Boolean
    $orderDate: String
    $orderStatus: String
  ) {
    feedbackMessages(
      page: $page
      itemsPerPage: $itemsPerPage
      firstname: $firstname
      lastname: $lastname
      email: $email
      status: $status
      deleted: $deleted
      order: [{ status: $orderStatus }, { createdAt: $orderDate }]
    ) {
      collection {
        id
        firstname
        lastname
        email
        status
        createdAt
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
`;

const GET_FEEDBACK_MESSAGE_BY_ID = gql`
  query getFeedbackMessageById($id: ID!) {
    feedbackMessage(id: $id) {
      id
      firstname
      lastname
      message
      email
      createdAt
      status
      feedbackDetails {
        id
        message
        createdAt
        author
      }
    }
  }
`;

export {
  GET_ALL_FEEDBACK_MESSAGE,
  GET_FEEDBACK_MESSAGE_BY_ID
}