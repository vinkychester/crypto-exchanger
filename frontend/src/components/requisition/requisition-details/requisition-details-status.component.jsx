import React from "react";

import { StyledRequisitionDetailsStatus } from "./styled-requisition-details-status";
import {
  StyledStatusIcon,
  StyledStatusItem,
  StyledStatusTitle,
} from "./styled-requisition-details-status";

import { requisitionStatusConst } from "../../../utils/consts.util";

const RequisitionDetailsStatus = ({ status }) => {
  switch (status) {
    case requisitionStatusConst.PROCESSED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="done" />
          <RequisitionStatusStep title="Paid" type="done" />
          <RequisitionStatusStep title="Wait for payout" type="inProgress" />
          <RequisitionStatusStep title="Done" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.CARD_VERIFICATION: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="done" />
          <RequisitionStatusStep title="Paid" type="done" />
          <RequisitionStatusStep title="Wait for payout" type="inProgress" />
          <RequisitionStatusStep title="Done" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.FINISHED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="done" />
          <RequisitionStatusStep title="Paid" type="done" />
          <RequisitionStatusStep title="Paid out" type="done" />
          <RequisitionStatusStep title="Done" type="done" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.CANCELED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="canceled" />
          <RequisitionStatusStep title="Canceled" type="canceled" />
          <RequisitionStatusStep title="Canceled" type="canceled" />
          <RequisitionStatusStep title="Closed" type="canceled" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.DISABLED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="canceled" />
          <RequisitionStatusStep title="Awaiting payment" type="canceled" />
          <RequisitionStatusStep title="Canceled" type="canceled" />
          <RequisitionStatusStep title="Payment deadline expired" type="disabled"
          />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.ERROR: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="done" />
          <RequisitionStatusStep title="Transaction error" type="error" />
          <RequisitionStatusStep title="-" type="waiting" />
          <RequisitionStatusStep title="-" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    default: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="New order" type="done" />
          <RequisitionStatusStep title="Awaiting payment" type="inProgress" />
          <RequisitionStatusStep title="Wait for payout" type="waiting" />
          <RequisitionStatusStep title="Done" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
  }
};

const RequisitionStatusStep = ({ title, type }) => {
  return (
    <StyledStatusItem type={type} className="step">
      <StyledStatusIcon className="step__icon" />
      <StyledStatusTitle className="step__title">{title}</StyledStatusTitle>
    </StyledStatusItem>
  );
};

export default RequisitionDetailsStatus;
