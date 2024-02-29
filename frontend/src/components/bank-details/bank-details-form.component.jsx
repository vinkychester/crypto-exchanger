import React, { useCallback, useContext, useEffect, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import Select, { Option } from "rc-select";

import BankDetailsAttributes from "./bank-details-attributes.component";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";

import { GET_ONLY_ACTIVE_PAIR_UNITS } from "../../graphql/queries/pair-unit.query";
import { CREATE_BANK_DETAILS } from "../../graphql/mutations/bank-detail.mutation";
import { GET_CLIENT_BANK_DETAILS } from "../../graphql/queries/bank-detail.query";

import { parseApiErrors } from "../../utils/response.util";
import { validateCryptoWallet } from "../../utils/crypto.util";

import { BankDetailsFilterContext } from "./bank-details.container";
import { StyledSelect } from "../styles/styled-select";

const INITIAL_STATE = {
  title: "",
  pairUnit: "",
  direction: ""
};

const BankDetailsForm = () => {
  const client = useApolloClient();
  const { userId } = client.readQuery({ query: GET_USER_CACHE_DETAILS });

  const { filter } = useContext(BankDetailsFilterContext);
  const { page, itemsPerPage, ...props  } = filter;
  const currentPage = page ? parseInt(page) : 1;

  const [errors, setErrors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [requisitesDetails, setRequisitesDetails] = useState(INITIAL_STATE);
  const [asset, setAsset] = useState("");

  const { data, loading, error } = useQuery(GET_ONLY_ACTIVE_PAIR_UNITS, { fetchPolicy: "network-only" });

  const [createBankDetail, { loading: mutationLoading }] = useMutation(CREATE_BANK_DETAILS, {
    onCompleted: () => {
      setRequisitesDetails((prevState) => ({ ...prevState, title: "" }));
      setAttributes([]);
      setErrors([]);
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeRequisitesDetails = useCallback(
    (obj) => {
      setRequisitesDetails((prevState) => ({
        ...prevState,
        ...obj
      }));
    },
    [requisitesDetails]
  );

  useEffect(() => {
    if (data && data.pairUnits) {
      const { collection } = data.pairUnits;
      if (collection.length !== 0) {
        setAsset(collection[0].currency.asset);
        handleChangeRequisitesDetails({
          pairUnit: collection[0].id,
          direction: collection[0].direction
        });
        setCollection(collection);
      }
    }
  }, [data]);

  const handleChangeSelect = (value, { label }) => {
    setAttributes([]);
    let info = label.split("-");
    setAsset(info[0]);
    handleChangeRequisitesDetails({ pairUnit: value, direction: info[1] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { title, pairUnit, direction } = requisitesDetails;
    let isWalletError = false;
    let regex = /\(\w+\)/;

    let wallet = attributes.find((item) => item.name === "wallet");
    if (wallet && !regex.test(asset) && !validateCryptoWallet(asset, wallet.value.trim())) {
      setErrors({ wallet: "Invalid wallet" });
      isWalletError = true;
    }

    if (!isWalletError) {
      createBankDetail({
        variables: {
          attributes,
          title,
          pairUnit,
          direction,
          client: `/api/users/${userId}`
        },
        refetchQueries: [
          {
            query: GET_CLIENT_BANK_DETAILS,
            variables: {
              itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
              page: currentPage,
              client_id: userId,
              ...props,
            },
          },
        ],
      });
    }
  };

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  if (!collection.length) return <span>Payment systems are absent</span>;

  return (
    <>
    {mutationLoading && <span>loading</span>}
      <form onSubmit={handleSubmit}>
        <StyledSelect className="choose-direction">
          <Select
            className="custom-select"
            defaultValue={collection[0].id}
            onChange={handleChangeSelect}
            name="pair_units"
          >
            {collection &&
            collection.map(({ id, paymentSystem, currency, direction }) => (
              <Option
                key={id}
                value={id}
                label={`${currency.asset}-${direction}`}
              >
                <div className="option-select-item">
                  <b>{paymentSystem.name}</b>{" "}{currency.asset}{" "} <small>{direction}</small>
                </div>
              </Option>
            ))}
          </Select>
        </StyledSelect>

        {requisitesDetails.pairUnit && requisitesDetails.direction ? (
          <BankDetailsAttributes
            details={requisitesDetails}
            attributes={attributes}
            setAttributes={setAttributes}
            handleChangeRequisitesDetails={handleChangeRequisitesDetails}
            errors={errors}
          />
        ) : null}
      </form>
    </>
  );
};

export default React.memo(BankDetailsForm);