import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import Select, { Option } from "rc-select";
import AlertMessage from "../alert/alert.component";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-select";

import { GET_USER_CACHE_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS_BY_DIRECTION } from "../../graphql/queries/bank-detail.query";
import { CalculatorAttributesContext, CalculatorContext } from "./calculator.container";
import { CalculatorAttributesContentContext } from "./calculator-attributes.component";
import SelectSkeleton from "../skeletons/skeleton-select";

const CalculatorSavedAttributes = ({ fieldName }) => {
  const client = useApolloClient();

  const { handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, pairUnitId, attributes } = useContext(CalculatorAttributesContext);
  const { handleToggleCheckbox } = useContext(CalculatorAttributesContentContext);

  const { userId } = client.readQuery({
    query: GET_USER_CACHE_DETAILS,
  });

  const { data, loading, error } = useQuery(
    GET_CLIENT_BANK_DETAILS_BY_DIRECTION,
    {
      variables: { client_id: userId, direction, pairUnit_id: pairUnitId },
    }
  );

  const field = `${direction}Attributes`;
  const saveField = `save${direction[0].toUpperCase() + direction.slice(1)}BankDetails`;

  const handleChangeSelect = (value, { label, key }) => {
    handleToggleCheckbox(false);
    //attributes.concat(label)
    handleChangeRequisitionDetails(field, label);
    handleChangeRequisitionDetails(saveField, false);
  };

  if (loading) return <SelectSkeleton optionWidth="10" label="Choose from saved" />
  if (error) return <AlertMessage type="error" message="Error" margin="0 0 10px" />;
  if (!data) <AlertMessage type="warning" message="Not found" margin="0 0 10px" />;

  const { collection } = data.bankDetails;

  if (!collection.length) return <></>;

  return (
    <StyledSelect>
      <StyledSelectLabel htmlFor={fieldName}>Choose from saved:</StyledSelectLabel>
      <Select
        className="custom-select"
        id={fieldName}
        name={fieldName}
        fieldName
        onChange={handleChangeSelect}
      >
        <Option value="" label={[]}>
          <div className="option-select-item">
            Choose from saved
          </div>
        </Option>
        {collection &&
          collection.map(({ title, attributes }) => {
            const result = attributes.find((item) => item.name === fieldName);
            const { id, value } = result;
            return (
              <Option key={id} value={value} label={attributes}>
                <div className="option-select-item">
                  {value} ({title})
                </div>
              </Option>
            );
          })}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(CalculatorSavedAttributes);
