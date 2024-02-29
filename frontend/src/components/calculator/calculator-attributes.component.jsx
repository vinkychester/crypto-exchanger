import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Checkbox from "rc-checkbox";

import CalculatorAttributesItem from "./calculator-attributes-item.component";
import SkeletonInput from "../skeletons/skeleton-input";
import AlertMessage from "../alert/alert.component";

import { StyledRequisitesField } from "./styled-calculator";
import { StyledCheckboxLabel, StyledCheckboxWrapper } from "../styles/styled-checkbox";

import { GET_ATTRIBUTES } from "../../graphql/queries/attribute.query";
import { CalculatorAttributesContext, CalculatorContext } from "./calculator.container";

export const CalculatorAttributesContentContext = createContext();

const CalculatorAttributes = () => {
  const { handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, pairUnitId, saveBankDetails } = useContext(CalculatorAttributesContext);

  const { data, loading, error } = useQuery(GET_ATTRIBUTES, {
    variables: { pairUnit_id: pairUnitId, direction, locale: "en" },
    fetchPolicy: "network-only"
  });

  const [isShowCheckbox, setShowCheckbox] = useState(true);

  const handleToggleCheckbox = useCallback(
    (state) => {
      setShowCheckbox(state);
    },
    [isShowCheckbox]
  );

  const field = `${direction}Attributes`;
  const checkbox = `save${direction.charAt(0).toUpperCase() + direction.slice(1)}BankDetails`;

  useEffect(() => {
    if (data) {
      const { collectionQueryAttributes } = data;
      if (0 !== collectionQueryAttributes.length) {
        let requisites = [];
        collectionQueryAttributes.map(({ id, fieldType, name }) => {
          if ("hidden" === fieldType) {
            requisites.push({
              id,
              name,
              isHidden: true,
              value: "",
              information: null
            });
          }
        });
        handleChangeRequisitionDetails(field, requisites);
      }
    }
  }, [data]);

  if (loading) return <SkeletonInput width="10" label="skeleton" />;
  if (error) return <AlertMessage type="error" message="Error" margin="0 0 10px" />;
  if (!data) <AlertMessage type="warning" message="Not found" margin="0 0 10px" />;

  const { collectionQueryAttributes } = data;

  if (!collectionQueryAttributes.length) return <></>;

  return (
    <StyledRequisitesField>
      <div className="requisite-label">
        {"payment" === direction ? "Payment requisites:" : "Payout requisites:"}
      </div>
      <CalculatorAttributesContentContext.Provider
        value={{ collectionQueryAttributes, handleToggleCheckbox }}
      >
        <CalculatorAttributesItem />
      </CalculatorAttributesContentContext.Provider>
      {isShowCheckbox && (
        <StyledCheckboxWrapper margin="15px 0 0">
          <Checkbox
            id={`${direction}_save_details`}
            className="default-checkbox"
            onClick={() => handleChangeRequisitionDetails(checkbox, !saveBankDetails)}
            name={`${direction}_save_details`}
            value={saveBankDetails}
          />
          <StyledCheckboxLabel position="right" htmlFor={`${direction}_save_details`}>
            Save requisites
          </StyledCheckboxLabel>
        </StyledCheckboxWrapper>
      )}
    </StyledRequisitesField>
  );
};

export default React.memo(CalculatorAttributes);
