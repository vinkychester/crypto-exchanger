import React from "react";
import { useApolloClient } from "@apollo/client";
import { NavLink, useHistory } from "react-router-dom";

import Can from "../../../components/can/can.component";
import CardVerificationDelete from "./card-verification-delete.component";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";
import RenderStatus from "../../styles/styled-status";
import { FormattedMessage } from "react-intl";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";

import {
  StyledCardInfoItem,
  StyledCardRow,
  StyledCardWrapper,
  StyledDropdownMenu,
  StyledMenuLink
} from "../../styles/styled-card";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { convertTimestampToDate } from "../../../utils/datetime.util";
import { cardVerification } from "../../../rbac-consts";
import { parseUuidIRI } from "../../../utils/response.util";
import { creditCardStatuses } from "../../../utils/consts.util";

const CardVerificationItem = ({
  id,
  cardNumber,
  cardMask,
  expiryDate,
  status,
  createdAt,
  client,
  refetch
}) => {
  const history = useHistory();
  const clientApollo = useApolloClient();

  const { userRole } = clientApollo.readQuery({ query: GET_USER_CACHE_DETAILS });
  const { id: clientId, firstname, lastname, email } = client;

  const showDetails = (e) => {
    if (e.target.tagName === "DIV") {
      history.push(`/panel/card-verification/details/${parseUuidIRI(id)}`);
    }
  };

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink
            as={NavLink}
            to={`/panel/card-verification/details/${parseUuidIRI(id)}`}
          >
            Details
          </StyledMenuLink>
        </MenuItem>
        {status === creditCardStatuses.CANCELED && (
          <Can
            role={userRole}
            perform={cardVerification.DELETE}
            yes={() => (
              <MenuItem key="2">
                <CardVerificationDelete
                  id={id}
                  cardMask={cardMask}
                  refetch={refetch}
                />
              </MenuItem>
            )}
          />
        )}
      </Menu>
    );
  };

  return (
    <StyledCardWrapper className="card-verification-item" onClick={showDetails}>
      <div className="card-verification-item__head">
        <CopyToClipboard
          text={userRole !== "client" ? cardNumber : cardMask}
          onCopy={() => closableNotificationWithClick("Copied", "success")}
        >
          <div title="Copy" className="card-verification-item__number">
            {userRole !== "client" ? cardNumber : cardMask}
            <span className="icon-copy" />
          </div>
        </CopyToClipboard>
      </div>
      <div className="card-verification-item__body">
        <StyledCardRow col={userRole === "client" ? 3 : 4} className="card-verification-item__row">
          <StyledCardInfoItem data-title="Date of creation">
            <p>{convertTimestampToDate(createdAt)}</p>
          </StyledCardInfoItem>
          <Can
            role={userRole}
            perform={cardVerification.CLIENT_DETAILS}
            yes={() => (
              <div className="user">
                <StyledCardInfoItem data-title="Client">
                  <div className="user__name">
                    <NavLink
                      to={`/panel/clients/${parseUuidIRI(clientId)}`}
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
                <StyledCardInfoItem data-title="Client e-mail">
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
          <StyledCardInfoItem data-title="Expire date">
            {expiryDate}
          </StyledCardInfoItem>
          <div className="card-verification-item__status">
            <FormattedMessage id={status}>
              {txt =>
                <RenderStatus color={status} status={txt} />
              }
            </FormattedMessage>
          </div>
        </StyledCardRow>
        <StyledDropdownMenu className="card-verification-item__action">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <button className="icon-menu-dots-vertical" />
          </Dropdown>
        </StyledDropdownMenu>
      </div>
    </StyledCardWrapper>
  );
};

export default React.memo(CardVerificationItem);
