import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import PairUnitSelect from "./pair-unit-select.component";

import DelayInputComponent from "../../input-group/delay-input-group";
import { parseApiErrors } from "../../../utils/response.util";
import { filterPairUnitsByDirection } from "../../../utils/pairUnits.util";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { StyledButton } from "../../styles/styled-button";

import { GET_ACTIVE_PAIR_UNITS } from "../../../graphql/queries/pair-unit.query";
import { CREATE_PAIR } from "../../../graphql/mutations/pair.mutation";
import { GET_ALL_PAIRS_WITH_IS_REQUISITION } from "../../../graphql/queries/pair.query";

import { PairFilterContext } from "./pair.container";

const INITIAL_STATE = { percent: 0, payment: 0, payout: 0 };

const PairForm = (callback, deps) => {
  const [pairDetails, setPairDetails] = useState(INITIAL_STATE);

  const { filter, handleChangeFilter } = useContext(PairFilterContext);
  const { pitemsPerPage } = filter;

  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});

  const { page, active} = object;
  const { data, loading, error } = useQuery(GET_ACTIVE_PAIR_UNITS, { fetchPolicy: "network-only" });

  const currentPage = page ? parseInt(page) : 1;

  const [createPair, { loading: mutationLoading }] = useMutation(CREATE_PAIR, {
    onCompleted: () => {
      setPairDetails(prevState => ({ ...prevState, percent: 0, priority: "" }));
    },
    refetchQueries: () => [
      {
        query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
        variables: {
          ...object,
          active: active ? active === "true" : null,
          itemsPerPage: pitemsPerPage ? parseInt(pitemsPerPage) : 50,
          page: currentPage
        }
      }
    ],
    onError: ({ graphQLErrors }) => {
      if (parseApiErrors(graphQLErrors).payment) {
        closableNotificationWithClick(parseApiErrors(graphQLErrors).payment,"error");
      }
    }
  });

  useEffect(() => {
    if (data) {
      const { collection } = data.pairUnits;
      if (collection.length !== 0) {
        const paymentCollection = filterPairUnitsByDirection(
          collection,
          "payment"
        );
        const payoutCollection = filterPairUnitsByDirection(
          collection,
          "payout"
        );

        setPairDetails((prevState) => ({
          ...prevState,
          payment: paymentCollection[0]?.id,
          payout: payoutCollection[0]?.id
        }));
      } else {
        closableNotificationWithClick("Configure tabs and activity for payment systems", "warning");
      }
    }
  }, [data]);

  const handleChangeInput = useCallback((event) => {
    const { name, value } = event.target;
    setPairDetails((prevState) => ({ ...prevState, [name]: +value }));
  });

  const handleChangeSelect = useCallback((direction, value) => {
    setPairDetails((prevState) => ({ ...prevState, [direction]: value }));
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collection } = data.pairUnits;

  const paymentCollection = filterPairUnitsByDirection(collection, "payment");
  const payoutCollection = filterPairUnitsByDirection(collection, "payout");

  const onSubmit = (event) => {
    event.preventDefault();

    if (!Array.isArray(pairDetails.payment) && !Array.isArray(pairDetails.payout)) {
      createPair({ variables: { ...pairDetails } });
    }
    if (Array.isArray(pairDetails.payment) && !Array.isArray(pairDetails.payout)) {
      pairDetails.payment.map(payment => {
        createPair({ variables: { ...pairDetails, payment } });
      });
    }
    if (!Array.isArray(pairDetails.payment) && Array.isArray(pairDetails.payout)) {
      pairDetails.payout.map(payout => {
        createPair({ variables: { ...pairDetails, payout } });
      });
    }
    if (Array.isArray(pairDetails.payment) && Array.isArray(pairDetails.payout)) {
      pairDetails.payment.map(payment => {
        pairDetails.payout.map(payout => {
          createPair({ variables: { ...pairDetails, payment, payout } });
        });
      });
    }
  };

  const { payment, payout, percent } = pairDetails;

  return (
    <>
      {mutationLoading && <span>...loading</span>}
      <form onSubmit={onSubmit}>
        <PairUnitSelect
          label="I give"
          direction="payment"
          selected={payment}
          collection={paymentCollection}
          handleChangeSelect={handleChangeSelect}
        />
        <PairUnitSelect
          label="You get"
          direction="payout"
          selected={payout}
          collection={payoutCollection}
          handleChangeSelect={handleChangeSelect}
        />
        <DelayInputComponent
          label="Percent"
          type="number"
          id="percent"
          name="percent"
          handleChange={handleChangeInput}
          value={percent}
          autoComplete="off"
          debounceTimeout={600}
        />
        <StyledButton mb="15" color="main" type="submit">
          Create
        </StyledButton>
      </form>
    </>
  );
};

export default PairForm;