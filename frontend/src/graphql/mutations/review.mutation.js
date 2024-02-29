import { gql } from "@apollo/client";

const CREATE_REVIEW = gql`
  mutation createReview($message: String!, $client: String!) {
    createReview(input: { message: $message, client: $client }) {
      review {
        id
      }
    }
  }
`;

const UPDATE_REVIEW_DETAILS = gql`
  mutation setPublishedReview($id: ID!, $publish: Boolean, $message: String) {
    updateReview(input: { id: $id, publish: $publish, message: $message }) {
      review {
        id
      }
    }
  }
`;

const DELETE_REVIEW_BY_ID = gql`
  mutation deleteReviewById($id: ID!) {
    deleteReview(input: { id: $id }) {
      review {
        id
      }
    }
  }
`;

export {
  CREATE_REVIEW,
  UPDATE_REVIEW_DETAILS,
  DELETE_REVIEW_BY_ID
}