import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";

import { StyledButton } from "../../styles/styled-button";

import { CREATE_INVOICE } from "../../../graphql/mutations/invoice.mutation";
import { RequisitionDetailsContext } from "./requisition-details.component";

const RequisitionDetailsPayment = ({ label }) => {
  const { requisitionId, refetch } = useContext(RequisitionDetailsContext);

  const [CreateInvoice, { loading, data, error }] = useMutation(CREATE_INVOICE, {
    onCompleted: () => refetch({ variables: { id: requisitionId } }),
    onError: () => refetch({ variables: { id: requisitionId } })
  });

  const handleCreateInvoice = () => {
    CreateInvoice({ variables: { requisition: requisitionId } });
  };

  return (
    <>
      <StyledButton color="success" onClick={handleCreateInvoice}>
        {label}
      </StyledButton>
    </>
  );
};

export default React.memo(RequisitionDetailsPayment);