import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { StyledCalculatorWrapper, StyledRequisitesWrapper } from "./styled-calculator";

// import CalculatorTab from "./calculator-tab.component";
// import CalculatorAttributes from "./calculator-attributes.component";
// import CalculatorExchange from "./calculator-exchange.component";
// import CalculatorRequisites from "./calculator-requisites.component";
import { GET_CALCULATED_DETAILS } from "../../graphql/queries/pair.query";
import { findPair, generateUrl } from "../../utils/calculator.util";
import { parseIRI } from "../../utils/response.util";

const CalculatorTab = React.lazy(() => import("./calculator-tab.component"));
const CalculatorAttributes = React.lazy(() => import("./calculator-attributes.component"));
const CalculatorExchange = React.lazy(() => import("./calculator-exchange.component"));
const CalculatorSwap = React.lazy(() => import("./calculator-swap.component"));
const CalculatorRequisites = React.lazy(() => import("./calculator-requisites.component"));

export const CalculatorContext = createContext();
export const CalculatorTabContext = createContext();
export const CalculatorFooterContext = createContext();
export const CalculatorExchangeContext = createContext();
export const CalculatorAttributesContext = createContext();

const INITIAL_EXCHANGE_VALUE_STATE = {
  paymentExchangeValue: null,
  payoutExchangeValue: null
};
const INITIAL_COLLECTION_STATE = { 
  paymentCollection: [], 
  payoutCollection: [] 
};
const INITIAL_REQUISITION_STATE = {
  paymentAmount: 0,
  payoutAmount: 0,
  pair: undefined,
  savePaymentBankDetails: false,
  savePayoutBankDetails: false,
  paymentAttributes: [],
  payoutAttributes: []
};

const CalculatorContainer = () => {
  // initial variables
  const [state, setState] = useState("payment");
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState({ paymentTab: "bank", payoutTab: "coin" });
  // with defind object
  const [requisitionDetails, setRequisitionDetails] = useState(INITIAL_REQUISITION_STATE);
  const [exchangeValue, setExchangeValue] = useState(INITIAL_EXCHANGE_VALUE_STATE);
  const [collection, setCollection] = useState(INITIAL_COLLECTION_STATE);
  // boolean variables
  const [isHandleSwap, setHandleSwap] = useState(false);
  const [isShowRequisites, setShowRequisites] = useState(false);

  const handleChangeRequisitionDetails = useCallback(
    (name, value) => {
      setRequisitionDetails((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    [requisitionDetails]
  );

  const [GetCalcuatedDetails, { loading: calculatedDetailsLoading }] = useLazyQuery(GET_CALCULATED_DETAILS, {
    onCompleted: ({ calculationQueryPair }) => {
      const { amount } = calculationQueryPair[state];
      handleChangeRequisitionDetails(`${state}Amount`, amount);
      // setErrors({});
    }
    // onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeRequisitionAmount = useCallback(
    (amount, direction) => {
      const includePayment = "payout" === direction;
      const includePayout = "payment" === direction;

      handleChangeRequisitionDetails(`${direction}Amount`, amount);
      setState(direction === "payment" ? "payout" : "payment");

      GetCalcuatedDetails({
        variables: {
          id: pair,
          direction,
          amount: parseFloat(amount.replace(/,/g, ".")),
          includePayment,
          includePayout
        }
      });
    },
    [requisitionDetails.paymentAmount, requisitionDetails.payoutAmount]
  );

  const handleChangeExchangeValue = useCallback(
    (node, direction) => {
      setShowRequisites(false);
      setErrors({});

      // set exchange value
      const exchangeValue = `${direction}ExchangeValue`;
      setExchangeValue((prevState) => ({
        ...prevState,
        [exchangeValue]: node
      }));
    },
    [exchangeValue]
  );

  const handleChangeTabs = useCallback(
    (direction, value) => {
      setTab((prevState) => ({
        ...prevState,
        [`${direction}Tab`]: value,
      }));
    },
    [tab]
  );

  const handleShowRequisites = useCallback(
    (status) => {
      setShowRequisites(status);
    },
    [isShowRequisites]
  );

  const handleChangeCollection = useCallback(
    (collection, direction) => {
      setCollection((prevState) => ({
        ...prevState,
        [`${direction}Collection`]: collection,
      }));
    },
    [collection]
  );

  const handleChangeSwap = useCallback(
    (status) => {
      setHandleSwap(status);
    },
    [isHandleSwap]
  );

  const handleChangeErrors = useCallback(
    (obj) => {
      setErrors(obj);
    },
    [errors]
  );

  useEffect(() => {
    const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;
    if (paymentExchangeValue && payoutExchangeValue) {
      const pairIRI = findPair(paymentExchangeValue, payoutExchangeValue);
      handleChangeRequisitionDetails("pair", pairIRI);
      setHandleSwap(false);

      if (pairIRI) {
        window.history.pushState({}, "", generateUrl(paymentExchangeValue, payoutExchangeValue));
      } else {
        window.history.pushState({}, document.title, "/");
      }
    }
  }, [exchangeValue]);

  const isCollection = Object.values(exchangeValue).every(x => x !== null);

  const {
    pair,
    paymentAmount,
    payoutAmount,
    paymentAttributes,
    payoutAttributes,
    savePaymentBankDetails,
    savePayoutBankDetails
  } = requisitionDetails;
  const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;
  const { paymentTab, payoutTab } = tab;

  console.log(typeof paymentAmount);

  return (
    <StyledCalculatorWrapper>
      <CalculatorContext.Provider
        value={{
          pair,
          errors,
          isHandleSwap,
          handleChangeRequisitionDetails,
          handleChangeExchangeValue,
          handleChangeCollection,
          handleChangeErrors,
          handleChangeTabs
        }}
      >
        <CalculatorTabContext.Provider
          value={{
            direction: "payment",
            tab: paymentTab,
            exchangeValue: paymentExchangeValue,
            inverseExchangeValue: payoutExchangeValue,
          }}
        >
          <CalculatorFooterContext.Provider
            value={{
              amount: paymentAmount,
              loading: calculatedDetailsLoading && state === "payment",
              handleChangeRequisitionAmount
            }}
          >
            <CalculatorTab label="You send" />
          </CalculatorFooterContext.Provider>
        </CalculatorTabContext.Provider>
        <CalculatorSwap 
          exchangeValue={exchangeValue} 
          collection={collection} 
          handleChangeSwap={handleChangeSwap}
        />
        <CalculatorTabContext.Provider
          value={{
            direction: "payout",
            tab: payoutTab,
            exchangeValue: payoutExchangeValue,
            inverseExchangeValue: paymentExchangeValue,
          }}
        >
          <CalculatorFooterContext.Provider
            value={{
              amount: payoutAmount,
              loading: calculatedDetailsLoading && state === "payout",
              handleChangeRequisitionAmount
            }}
          >
            <CalculatorTab label="Recipient gets" />
          </CalculatorFooterContext.Provider>
        </CalculatorTabContext.Provider>
        <CalculatorExchangeContext.Provider
          value={{
            isShowRequisites,
            isCollection,
            handleShowRequisites
          }}
        >
          <CalculatorExchange />
          {isShowRequisites && (
            <StyledRequisitesWrapper className="calculator__footer">
              <CalculatorAttributesContext.Provider
                value={{
                  direction: "payment",
                  attributes: paymentAttributes,
                  pairUnitId: parseIRI(paymentExchangeValue.id),
                  saveBankDetails: savePaymentBankDetails
                }}
              >
                <CalculatorAttributes />
              </CalculatorAttributesContext.Provider>
              <CalculatorAttributesContext.Provider
                value={{
                  direction: "payout",
                  attributes: payoutAttributes,
                  pairUnitId: parseIRI(payoutExchangeValue.id),
                  saveBankDetails: savePayoutBankDetails
                }}
              >
                <CalculatorAttributes />
              </CalculatorAttributesContext.Provider>
              <CalculatorRequisites
                requisitionDetails={requisitionDetails}
                exchangeValue={exchangeValue}
              />
            </StyledRequisitesWrapper>
          )}
        </CalculatorExchangeContext.Provider>
      </CalculatorContext.Provider>
      {!pair && isCollection && <p>No exchange</p>}
    </StyledCalculatorWrapper>
  );
};

export default React.memo(CalculatorContainer);
