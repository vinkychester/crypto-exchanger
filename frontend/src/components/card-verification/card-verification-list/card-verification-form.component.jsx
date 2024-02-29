import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ImageUploading from "react-images-uploading";

import DelayInputComponent from "../../input-group/delay-input-group";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { StyledButton } from "../../styles/styled-button";
import { StyledVerificationCardImages } from "./styled-card-verification-list";

import { GET_USER_CACHE_DETAILS } from "../../../graphql/queries/user.query";
import { CREATE_CREDIT_CARD } from "../../../graphql/mutations/credit-card.mutation";
import { GET_CREDIT_CARDS } from "../../../graphql/queries/credit-card.query";
import { hideCreditCardSigns, parseApiErrors } from "../../../utils/response.util";

const INITIAL_STATE = {
  cardNumber: "",
  expiryDate: "",
  cardMask: "",
  files: [],
};

const CardVerificationForm = () => {
  const history = useHistory();
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const [cardVerificationDetails, setCardVerificationDetails] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState("");

  const [CreateCreditCard, { loading }] = useMutation(CREATE_CREDIT_CARD, {
    onCompleted: () => {
      setCardVerificationDetails(INITIAL_STATE);
      setErrors("");
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeVerificationData = (event) => {
    const { name, value } = event.target;
    setCardVerificationDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleChangeFiles = (imageList, addUpdateIndex) => {
    setCardVerificationDetails((prevState) => ({
      ...prevState,
      files: imageList
    }));
  };

  const handleSubmit = (event) => { 
    event.preventDefault();

    const { cardNumber, files, ...props } = cardVerificationDetails;
    
    if (!files.length) {
      return closableNotificationWithClick("Upload a photo for verification", "warning");
    }

    const creditCard = cardNumber.replace(/-\s/g, "").replace(/\s+/g, "");

    CreateCreditCard({
      variables: {
        ...props,
        cardNumber: creditCard,
        cardMask: hideCreditCardSigns(creditCard),
        client: `/api/users/${userId}`,
        files, 
      },
      refetchQueries: [
        {
          query: GET_CREDIT_CARDS,
          variables: {
            // ...filterProps,
            itemsPerPage: 50,
            page: 1,
            // date_gte: convertDateToTimestamp(date_gte),
            // date_lte: convertDateToTimestamp(date_lte),
            client_id: userId,
          }
        }
      ]
    })
  };

  const { cardNumber, expiryDate, files } = cardVerificationDetails;

  return (
    <form onSubmit={handleSubmit} className="card-verification-form">
      <DelayInputComponent
        id="cardNumber"
        type="text"
        label="Card number"
        name="cardNumber"
        value={cardNumber ?? ""}
        debounceTimeout={600}
        handleChange={handleChangeVerificationData}
        errorMessage={errors.cardNumber}
        required
      />
      <DelayInputComponent
        id="expiryDate"
        type="text"
        label="expiry Date"
        name="expiryDate"
        value={expiryDate ?? ""}
        debounceTimeout={600}
        handleChange={handleChangeVerificationData}
        errorMessage={errors.expiryDate}
        required
      />
      <ImageUploading
        required
        multiple
        value={files}
        onChange={handleChangeFiles}
        maxNumber={10}
        maxFileSize={5242880}
        dataURLKey="data_url"
        acceptType={["jpg", "gif", "png", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          errors,
        }) => (
          <StyledVerificationCardImages>
            <div className="images__head">
              <StyledButton color="main" border type="button" onClick={onImageUpload}>Upload images</StyledButton>
              {errors && (
                <div className="images_errors">
                  <div>{errors.maxNumber && (<span>Max count of images: 10</span>)}</div>
                  <div>{errors.maxFileSize && (<span>Max upload image size: 5 MB</span>)}</div>
                  <div>{errors.acceptType && (<span>Types of images uploaded: jpg, gif, png, jpeg </span>)}</div>
                </div>
              )}
              {imageList.length !== 0 && <StyledButton color="danger" border type="button" onClick={onImageRemoveAll}>Clear images</StyledButton>}
            </div>
            <div className="images__body">
              {imageList.map((image, index) => (
                <div className="image-item" key={index}>
                  <LazyLoadImage src={image["data_url"]} alt="" />
                  <div className="image-item__action">
                    <button
                      className="action-button action-button_update"
                      onClick={() => onImageUpdate(index)}>
                      <span className="icon-cloud-upload"/>
                    </button>
                    <button
                      className="action-button action-button_remove"
                      onClick={() => onImageRemove(index)}>
                      <span className="icon-trash"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </StyledVerificationCardImages>
        )}
      </ImageUploading>
      <div className="card-verification-form__action">
        <StyledButton color="main" type="submit">Save</StyledButton>
      </div>
    </form>
  );
};

export default React.memo(CardVerificationForm);
