import { gql } from "@apollo/client";

const CREATE_FEEDBACK_MESSAGE = gql`
  mutation createFeedbackMessage(
    $firstname: String!
    $lastname: String!
    $email: String!
    $message: String!
  ) {
    createFeedbackMessage(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        message: $message
      }
    ) {
      feedbackMessage {
        id
      }
    }
  }
`;

const DELETE_FEEDBACK_MESSAGE_BY_ID = gql`
  mutation deleteFeedbackMessageById($id: ID!) {
    deleteFeedbackMessage(input: { id: $id }) {
      feedbackMessage {
        id
      }
    }
  }
`;

const UPDATE_FEEDBACK_MESSAGE_DETAILS = gql`
  mutation updateFeedbackMessageDetails(
    $id: ID!
    $deleted: Boolean
    $status: String
  ) {
    updateFeedbackMessage(
      input: { id: $id, deleted: $deleted, status: $status }
    ) {
      feedbackMessage {
        id
      }
    }
  }
`;

const CREATE_FEEDBACK_DETAIL = gql`
  mutation createFeedbackDetail(
    $feedbackMessageId: String!
    $message: String!
    $author: String!
  ) {
    createFeedbackDetail(
      input: {
        feedbackMessage: $feedbackMessageId
        message: $message
        author: $author
      }
    ) {
      feedbackDetail {
        id
      }
    }
  }
`;

export {
  CREATE_FEEDBACK_MESSAGE,
  DELETE_FEEDBACK_MESSAGE_BY_ID,
  UPDATE_FEEDBACK_MESSAGE_DETAILS,
  CREATE_FEEDBACK_DETAIL
};