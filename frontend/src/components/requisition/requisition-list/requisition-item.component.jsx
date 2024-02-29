import React from "react";
import { useApolloClient } from "@apollo/client";
import { NavLink, useHistory } from "react-router-dom";

import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";
import Can from "../../can/can.component";
import RenderStatus from "../../styles/styled-status";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import {
  StyledCardInfoItem,
  StyledCardRow,
  StyledCardWrapper,
  StyledDropdownMenu,
  StyledMenuLink
} from "../../styles/styled-card";
import { StyledExchangeItem } from "./styled-requisition-list";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { parseUuidIRI } from "../../../utils/response.util";
import { requisition } from "../../../rbac-consts";
import { convertTimestampToDate } from "../../../utils/datetime.util";
import { FormattedMessage } from "react-intl";

const RequisitionItem = ({
  id,
  pair,
  client,
  paymentAmount,
  payoutAmount,
  status,
  direction,
  createdAt
}) => {
  const history = useHistory();
  const clientApollo = useApolloClient();

  const { userRole } = clientApollo.readQuery({ query: GET_USER_CACHE_DETAILS });

  const { payment, payout } = pair;
  const { id: clientId, firstname, lastname, email } = client;

  const showDetails = (e) => {
    if (e.target.tagName === "DIV") {
      history.push(`/panel/requisition-details/${parseUuidIRI(id)}`);
    }
  };

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink
            as={NavLink}
            to={`/panel/requisition-details/${parseUuidIRI(id)}`}
          >
            Details
          </StyledMenuLink>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <StyledCardWrapper
      className="requisition-item"
      onClick={showDetails}
      title={`Show requisition details - ${parseUuidIRI(id).split("-")[0]}`}
    >
      <div className="requisition-item__head">
        <CopyToClipboard
          text={parseUuidIRI(id).split("-")[0].toUpperCase()}
          onCopy={() => closableNotificationWithClick("Copied", "success")}
        >
          <div title="Copy" className="requisition-item__number">
            {parseUuidIRI(id).split("-")[0].toUpperCase()}
            <span className="icon-copy" />
          </div>
        </CopyToClipboard>
        <FormattedMessage id={status}>
          {txt =>
            <RenderStatus color={status} status={txt} />
          }
        </FormattedMessage>
      </div>
      <div className="requisition-item__body">
        <StyledCardRow className="requisition-item__row" col={userRole === "client" ? 3 : 4}>
          <div>
            <StyledCardInfoItem mb="5" data-title="Date of creation">
              {convertTimestampToDate(createdAt)}
            </StyledCardInfoItem>
            <StyledCardInfoItem mb="5" data-title="Date of completion">
              --.--.---- --:--
            </StyledCardInfoItem>
          </div>
          <Can
            role={userRole}
            perform={requisition.CLIENT_DETAILS}
            yes={() => (
              <div className="user">
                <StyledCardInfoItem mb="5" data-title="Client">
                  <div className="user__name">
                    <NavLink
                      to={`/panel/client-details/${parseUuidIRI(clientId)}`}
                      title={`View customer profile ${firstname} ${lastname}`}
                    >
                      {firstname} {lastname}
                    </NavLink>
                    <CopyToClipboard
                      text={`${firstname} ${lastname}`}
                      onCopy={() => closableNotificationWithClick("Copied", "success")}
                    >
                      <span className="icon-copy" />
                    </CopyToClipboard>
                  </div>
                </StyledCardInfoItem>
                <StyledCardInfoItem mb="5" data-title="Client e-mail">
                  <div className="user__email">
                    {email}
                    <CopyToClipboard
                      text={email}
                      onCopy={() => closableNotificationWithClick("Copied", "success")}
                    >
                      <span className="icon-copy" />
                    </CopyToClipboard>
                  </div>
                </StyledCardInfoItem>
              </div>
            )}
          />
          <div>
            <StyledCardInfoItem mb="5" data-title="Payment system">
              <b>{payment.paymentSystem.name}</b>
            </StyledCardInfoItem>
            <StyledCardInfoItem mb="5" data-title="Type">
              {payment.currency.tag === "CRYPTO" ? "Selling" : "Purchase"}
            </StyledCardInfoItem>
          </div>
          <div>
            <StyledCardInfoItem mb="5" data-title="Amount of payment">
              <StyledExchangeItem>
                <span
                  className={`exchange-icon-${
                    payment.currency.tag === "CRYPTO" ? payment.currency.asset : payment.paymentSystem.tag
                  } exchange-icon`}
                />
                {paymentAmount} {payment.currency.asset}
              </StyledExchangeItem>
            </StyledCardInfoItem>
            <StyledCardInfoItem mb="5" data-title="Amount to be received">
              <StyledExchangeItem>
                <span
                  className={`exchange-icon-${
                    payout.currency.tag === "CRYPTO" ? payout.currency.asset : payout.paymentSystem.tag
                  } exchange-icon`}
                />
                {payoutAmount} {payout.currency.asset}
              </StyledExchangeItem>
            </StyledCardInfoItem>
          </div>
        </StyledCardRow>
        <StyledDropdownMenu className="requisition-item__action">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <button className="icon-menu-dots-vertical" />
          </Dropdown>
        </StyledDropdownMenu>
      </div>
    </StyledCardWrapper>
  );
};

export default React.memo(RequisitionItem);
