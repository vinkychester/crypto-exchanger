import { gql } from "@apollo/client";

import { REVIEW_DETAILS_FRAGMENT } from "../fragments/review.fragment";
import {
 USER_NAME_DETAILS_COLLECTION_FRAGMENT, USER_NAME_DETAILS_ITEM_FRAGMENT
} from "../fragments/user.fragment";

const GET_PUBLISHED_REVIEWS = gql`
  query getPublishedReviews($page: Int, $itemsPerPage: Int) {
    reviews(page: $page, itemsPerPage: $itemsPerPage, publish: true) {
      collection {
        ...ReviewDetails
        client {
          id
          firstname
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${REVIEW_DETAILS_FRAGMENT}
`;

const GET_ALL_REVIEWS_FILTER = gql`
  query getAllReviewsFilter(
    $page: Int = 1
    $itemsPerPage: Int
    $firstname: String
    $lastname: String
    $publish: Boolean
    $date_lte: String
    $date_gte: String
  ) {
    reviews(
      page: $page
      itemsPerPage: $itemsPerPage
      client_firstname: $firstname
      client_lastname: $lastname
      publish: $publish
      createdAt: [{ gte: $date_gte }, { lte: $date_lte }]
    ) {
      collection {
        ...ReviewDetails
        publish
        client {
          ...UserNameDetailsCollection
        }
      }
      paginationInfo {
        itemsPerPage
        lastPage
        totalCount
      }
    }
  }
  ${REVIEW_DETAILS_FRAGMENT}
  ${USER_NAME_DETAILS_COLLECTION_FRAGMENT}
`;

const GET_REVIEW_BY_ID = gql`
  query getReviewByID($id: ID!) {
    review(id: $id) {
      id
      message
      createdAt
      client {
        ...UserNameDetails
      }
    }
  }
  ${USER_NAME_DETAILS_ITEM_FRAGMENT}
`;

export { GET_PUBLISHED_REVIEWS, GET_ALL_REVIEWS_FILTER, GET_REVIEW_BY_ID };
