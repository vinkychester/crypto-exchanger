import React, { createContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";

import Can from "../../can/can.component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import RenderStatus from "../../styles/styled-status";
import RequisitionDetailsStatus from "./requisition-details-status.component";
import RequisitionDetailsTimer from "./requisition-details-timer.component";
import RequisitionDetailsAmountTab from "./requisition-details-amount-tab.component";
import RequisitionDetailsToggleStatus from "./requisition-details-toggle-status.component";
import RequisitionDetailsBankTab from "./requisition-details-bank-tab.component";
import RequisitionDetailsPayment from "./requisition-details-payment.component";
import RequistionDetailsInvoiceTab from "./requisition-details-invoice-tab.component";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import AlertMessage from "../../alert/alert.component";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";

import { StyledContainer } from "../../styles/styled-container";
import {
  StyledRequisitionDetailsCommission,
  StyledRequisitionDetailsData,
  StyledRequisitionDetailsDate,
  StyledRequisitionDetailsExchangeWrapper,
  StyledRequisitionDetailsHeader,
  StyledRequisitionDetailsShowCommissions,
  StyledRequisitionDetailsTitle,
  StyledRequisitionDetailsWrapper
} from "./styled-requisition-details";
import { StyledCardWrapper } from "../../styles/styled-card";
import { StyledBreadcrumb } from "../../breadcrumb/styled-breadcrumb";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { parseUuidIRI } from "../../../utils/response.util";
import { convertTimestampToDate } from "../../../utils/datetime.util";
import { requisitionStatusConst } from "../../../utils/consts.util";
import { requisition } from "../../../rbac-consts";
import { FormattedMessage } from "react-intl";

export const RequisitionDetailsContext = createContext();

const RequisitionDetails = ({
  id,
  createdAt,
  pair,
  status,
  paymentAmount,
  payoutAmount,
  requisitionFees,
  course,
  client,
  refetch,
  bankDetails,
  invoices
}) => {
  const clientApollo = useApolloClient();
  const [showCommission, setShowCommission] = useState(true);

  const { userRole, userId } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const token = parseUuidIRI(id).split("-")[0];
  const { payment, payout } = pair;

  return (
    <StyledContainer>
      <Helmet>
        <title>{`Order ${token} details | BuyCoin.Cash`}</title>
      </Helmet>
      <StyledRequisitionDetailsWrapper>
        <StyledRequisitionDetailsTitle>
          <CopyToClipboard
            text={token.toUpperCase()}
            onCopy={() => closableNotificationWithClick("Copied", "success")}
          >
            <div className="requisition-title">
              Order <span className="requisition-title__number">#{token}</span> <span className="icon-copy" />
            </div>
          </CopyToClipboard>
        </StyledRequisitionDetailsTitle>
        <RequisitionDetailsContext.Provider
          value={{ requisitionId: id, status, payment, payout, refetch }}
        >
        <StyledRequisitionDetailsHeader>
          <StyledBreadcrumb>
            <BreadcrumbItem as={NavLink} to="/" title="Home" />
            <BreadcrumbItem
              as={NavLink}
              to="/panel/requisitions"
              title="Requisitions"
            />
            <BreadcrumbItem as="span" title={`Order #${token}`} />
          </StyledBreadcrumb>
          <RequisitionDetailsTimer
            createdAt={createdAt}
          />
          <StyledRequisitionDetailsDate>
            <p className="requisition-date">
              {convertTimestampToDate(createdAt)}
            </p>
          </StyledRequisitionDetailsDate>
        </StyledRequisitionDetailsHeader>
        <StyledCardWrapper>
          <RequisitionDetailsStatus status={status} />

          <StyledRequisitionDetailsExchangeWrapper>
            <RequisitionDetailsAmountTab
              label="You send"
              info={payment}
              amount={paymentAmount}
            />
            <RequisitionDetailsAmountTab
              label="Recipient gets"
              info={payout}
              amount={payoutAmount}
            />
          </StyledRequisitionDetailsExchangeWrapper>

          <StyledRequisitionDetailsShowCommissions hide={showCommission}>
            <span onClick={()=> setShowCommission(!showCommission)}>
              More details . . .
            </span>
          </StyledRequisitionDetailsShowCommissions>
          <StyledRequisitionDetailsCommission hide={showCommission}>
            <div className="requisition-info">
              <div className="requisition-info__name">
                Course:
              </div>
              <div className="requisition-info__value">
                1 {payment.currency.tag === "CRYPTO" ? payment.currency.asset : payout.currency.asset} = {course.toFixed(4)} {payment.currency.tag === "CRYPTO" ? payout.currency.asset : payment.currency.asset}
              </div>
            </div>
            <div className="requisition-info">
              <div className="requisition-info__name">
                Payment system constant:
              </div>
              <div className="requisition-info__value">
                {payment.currency.tag === "CRYPTO" ?
                  `${requisitionFees.find((fee) => fee.type === "payout").constant} ${payout.currency.asset}` :
                  `${requisitionFees.find((fee) => fee.type === "payment").constant} ${payment.currency.asset}`}
              </div>
            </div>
            <div className="requisition-info">
              <div className="requisition-info__name">
                Payment system commission:
              </div>
              <div className="requisition-info__value">
                {payment.currency.tag === "CRYPTO" ?
                  requisitionFees.find((fee) => fee.type === "payout").percent :
                  requisitionFees.find((fee) => fee.type === "payment").percent}%
              </div>
            </div>
            <div className="requisition-info">
              <div className="requisition-info__name">
                Network fee:
              </div>
              <div className="requisition-info__value">
                {payment.currency.tag === "CRYPTO" ?
                  `${requisitionFees.find((fee) => fee.type === "payment").constant} ${payment.currency.asset}` :
                  `${requisitionFees.find((fee) => fee.type === "payout").constant} ${payout.currency.asset}`}
              </div>
            </div>
            <div className="requisition-info">
              <div className="requisition-info__name">
                Interworking fee:
              </div>
              <div className="requisition-info__value">
                {payment.currency.tag === "CRYPTO" ?
                  requisitionFees.find((fee) => fee.type === "payment").percent :
                  requisitionFees.find((fee) => fee.type === "payout").percent}%
              </div>
            </div>
          </StyledRequisitionDetailsCommission>
          <StyledRequisitionDetailsData>
            <FormattedMessage id={status}>
              {txt =>
                <RenderStatus className="requisition-status" color={status} status={txt} />
              }
            </FormattedMessage>
              <RequisitionDetailsBankTab bankDetails={bankDetails} />
              <RequistionDetailsInvoiceTab invoices={invoices} tag={payment.currency.tag} />
              <Can
                role={userRole}
                perform={requisition.ACTIONS}
                data={{ userId, ownerId: parseUuidIRI(client.id) }}
                yes={() =>
                  status === requisitionStatusConst.NEW && (
                    <div className="requisition-action">
                      <RequisitionDetailsToggleStatus
                        status={requisitionStatusConst.CANCELED}
                        message="Are you sure you want to cancel the order?"
                        btnText="Cancel"
                        color="danger"
                      />
                      <RequisitionDetailsPayment label="To Pay" />
                    </div>
                  )
                }
              />
          </StyledRequisitionDetailsData>
          {status === requisitionStatusConst.FINISHED && "client" === userRole && (
            <AlertMessage
              type="success"
              margin="20px 0 0"
              message={
                <>
                  <b>Order completed!</b> <br/>
                  Thank you for using our services. <br />
                  We will be very grateful if you{" "}
                  <NavLink
                  className="default-link"
                  to="/reviews"
                  target="_blank"
                  rel="noreferrer"
                  >
                  leave a review
                  </NavLink>{" "}
                  about the service, using any platform convenient for you, or directly on this website. <br />
                  We will be glad to see you again!
                </>
              }
            />
          )}
        </StyledCardWrapper>
        </RequisitionDetailsContext.Provider>
      </StyledRequisitionDetailsWrapper>
    </StyledContainer>
  );
};

export default React.memo(RequisitionDetails);
