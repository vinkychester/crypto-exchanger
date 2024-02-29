import { gql } from "@apollo/client";

const CREATE_INVOICE = gql`
  mutation CreateInvoice($requisition: String!) {
    createInvoice(input: { requisition: $requisition }) {
      invoice {
        id
        flowData {
          value
          name
        }
      } 
    }
  }
`;

export { CREATE_INVOICE };
