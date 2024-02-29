import React, { createContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Can from "../../../components/can/can.component";
import CardVerificationDetailsCancel from "./card-verification-details-cancel.component";
import CardVerificationDetailsApprove from "./card-verification-details-approve.component";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import RenderStatus from "../../styles/styled-status";
import { FormattedMessage } from "react-intl";

import { StyledContainer } from "../../styles/styled-container";
import {
  StyledCardVerificationDetailsData,
  StyledCardVerificationDetailsDate,
  StyledCardVerificationDetailsHeader,
  StyledCardVerificationDetailsTitle,
  StyledCardVerificationDetailsWrapper,
  StyledCVDetailsImages
} from "./styled-card-verification-details";
import { StyledBreadcrumb } from "../../breadcrumb/styled-breadcrumb";
import { StyledCardInfoItem, StyledCardWrapper } from "../../styles/styled-card";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { cardVerification } from "../../../rbac-consts";
import { parseUuidIRI } from "../../../utils/response.util";
import { convertTimestampToDate } from "../../../utils/datetime.util";
import { creditCardStatuses } from "../../../utils/consts.util";
import AlertMessage from "../../alert/alert.component";
import { StyledButton } from "../../styles/styled-button";

export const CardVerificationDetailsContext = createContext();

const CardVerificationDetails = ({
  id,
  expiryDate,
  cardMask,
  status,
  comment,
  createdAt,
  mediaObjects,
  client,
  cardNumber,
  refetch
}) => {
  const history = useHistory();
  const clientApollo = useApolloClient();

  const [lightbox, setLightbox] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(0);

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_CACHE_DETAILS
  });

  const handleRedirectToForm = () => {
    history.push({
      pathname: "/panel/card-verification",
      state: { isRedirect: true }
    });
  };

  let destructMediaObjects = mediaObjects.map((data) => ({ url: data.base64 }));

  const toggleLightbox = (index) => {
    setLightbox(!lightbox);
    setLightboxItem(index);
  };

  const { firstname, lastname, email } = client;

  return (
    <StyledContainer>
      <Helmet>
        <title>Card details | BuyCoin.Cash</title>
      </Helmet>
      <StyledCardVerificationDetailsWrapper>
        <StyledCardVerificationDetailsTitle>
          <CopyToClipboard
            text={userRole !== "client" ? cardNumber : cardMask}
            onCopy={() => closableNotificationWithClick("Copied", "success")}
          >
            <div className="card-verification-title">
              {userRole !== "client" ? cardNumber : cardMask} <span className="icon-copy" />
            </div>
          </CopyToClipboard>
        </StyledCardVerificationDetailsTitle>
        <StyledCardVerificationDetailsHeader>
          <StyledBreadcrumb>
            <BreadcrumbItem as={NavLink} to="/" title="Home" />
            <BreadcrumbItem
              as={NavLink}
              to="/panel/card-verification"
              title="Verification"
            />
            <BreadcrumbItem as="span" title="Card details" />
          </StyledBreadcrumb>
          <StyledCardVerificationDetailsDate>
            <p className="card-verification-date">
              <p>{convertTimestampToDate(createdAt)}</p>
            </p>
          </StyledCardVerificationDetailsDate>
        </StyledCardVerificationDetailsHeader>
      </StyledCardVerificationDetailsWrapper>
      <StyledCardWrapper>
        <StyledCardVerificationDetailsData>
          <FormattedMessage id={status}>
            {txt =>
              <RenderStatus className="card-verification-status" color={status} status={txt} />
            }
          </FormattedMessage>
          <Can
            role={userRole}
            perform={cardVerification.CLIENT_DETAILS}
            yes={() => (
              <div className="user">
                <StyledCardInfoItem data-title="Client">
                  <div className="user__name">
                    <NavLink
                      to={`/panel/clients/${parseUuidIRI(id)}`}
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

          <StyledCVDetailsImages>
            {mediaObjects && mediaObjects.map(({ id, index, base64 }) => (
              <div
                key={id}
                className="image-item"
                onClick={() => {toggleLightbox(index);}}
              >
                <LazyLoadImage src={base64} alt="" width="300" />
              </div>
            ))}
          </StyledCVDetailsImages>
          {lightbox && (
            <Lightbox
              images={destructMediaObjects}
              onClose={toggleLightbox}
              showTitle={false}
              startIndex={lightboxItem}
            />
          )}
          {creditCardStatuses.NOT_VERIFIED === status && (
            <Can
              role={userRole}
              perform={cardVerification.ACTIONS}
              yes={() => (
                <CardVerificationDetailsContext.Provider value={{ id, cardMask, refetch }}>
                  <div className="card-verification-action">
                    <CardVerificationDetailsCancel />
                    <CardVerificationDetailsApprove />
                  </div>
                </CardVerificationDetailsContext.Provider>
              )}
            />
          )}
          {comment &&
          <AlertMessage
            margin="15px 0 0"
            type="warning"
            message={comment}
          />}
          {status === creditCardStatuses.CANCELED && userRole === "client" && (
            <div className="card-verification-resend">
              <StyledButton color="main" type="button" onClick={handleRedirectToForm}>
                Resend
              </StyledButton>
            </div>)}
        </StyledCardVerificationDetailsData>
      </StyledCardWrapper>
    </StyledContainer>
  );
};

export default React.memo(CardVerificationDetails);
