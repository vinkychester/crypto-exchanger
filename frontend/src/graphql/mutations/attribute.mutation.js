import { gql } from "@apollo/client";

const UPDATE_ATTRIBUTE_DETAILS = gql`
  mutation updateAttributeDetail($id: ID!, $value: String) {
    updateAttribute(input: { id: $id, value: $value }) {
      attribute {
        id
        value
      }
    }
  }
`;

export { UPDATE_ATTRIBUTE_DETAILS }