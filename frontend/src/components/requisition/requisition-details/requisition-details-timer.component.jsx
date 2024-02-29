import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import Countdown from "react-countdown";
import Tooltip from "rc-tooltip";

import { UPDATE_REQUISITION_STATUS } from "../../../graphql/mutations/requisition.mutation";

import { GET_REQUISITION_DETAILS } from "../../../graphql/queries/requisition.query";

import { requisitionStatusConst } from "../../../utils/consts.util";
import { RequisitionDetailsContext } from "./requisition-details.component";

const RequisitionDetailsTimer = ({
  createdAt
}) => {

  const [updateStatus] = useMutation(UPDATE_REQUISITION_STATUS);
  const { requisitionId, status, refetch } = useContext(RequisitionDetailsContext);
  const handleComplete = () => {
    updateStatus({
      variables: { id: requisitionId, status: requisitionStatusConst.DISABLED },
      onCompleted: () => refetch({variables: { id: requisitionId }})
    });
  };

  const timer = 1000 * 60 * 60 * 24;

  return (
    <>
      {status === requisitionStatusConst.NEW && (
      <Tooltip
        placement="top"
        overlay="Remaining life of the application before automatic closing."
      >
        <Countdown
          date={createdAt * 1000 + timer}
          daysInHours={true}
          onComplete={handleComplete}
        />
      </Tooltip>
      )}
      {status === requisitionStatusConst.DISABLED && (
        <span>The application payment time has expired</span>
      )}
    </>
  );
};

export default React.memo(RequisitionDetailsTimer);
