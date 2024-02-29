import { gql } from "@apollo/client";
import { BANK_DETAIL_ITEM_FRAGMENT } from "../fragments/bank-detail.fragment";

const CREATE_BANK_DETAILS = gql`
  mutation createBankDetail(
    $attributes: Iterable!
    $title: String!
    $pairUnit: String!
    $direction: String!
    $client: String!
  ) {
    createBankDetail(
      input: {
        attributes: $attributes
        title: $title
        pairUnit: $pairUnit
        direction: $direction
        client: $client
      }
    ) {
      bankDetail {
        ...BankDetail
      }
    }
  }
  ${BANK_DETAIL_ITEM_FRAGMENT}
`;


const UPDATE_BANK_DETAILS = gql`
  mutation updateBankDetail($id: ID!, $title: String) {
    updateBankDetail(input: { id: $id, title: $title }) {
      bankDetail {
        id
      }
    }
  }
`;

export { UPDATE_BANK_DETAILS, CREATE_BANK_DETAILS }