import React, { useContext } from "react";
import { useMutation } from "@apollo/client";

import { StyledButton } from "../../styles/styled-button";

import { UPDATE_REQUISITION_DETAILS } from "../../../graphql/mutations/requisitiom.mutation";
import { RequisitionDetailsContext } from "./requisition-details.component";

const RequisitionDetailsToggleStatus = ({
  status,
  message,
  btnText,
  color,
}) => {
  const { requisitionId, refetch } = useContext(RequisitionDetailsContext);

  const [updateRequisition, { loading }] = useMutation(
    UPDATE_REQUISITION_DETAILS,
    {
      onCompleted: () => refetch({ variables: { id: requisitionId } }),
    }
  );

  const handleRequisition = () => {
    updateRequisition({ variables: { id: requisitionId, status } });
  };

  return (
    <StyledButton color="danger" border>{btnText}</StyledButton>
  )
};

export default React.memo(RequisitionDetailsToggleStatus);