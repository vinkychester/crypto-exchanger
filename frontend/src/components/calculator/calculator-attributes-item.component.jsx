import React, { useContext } from "react";

import CalculatorSavedAttributes from "./calculator-saved-attributes.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { CalculatorAttributesContext, CalculatorContext } from "./calculator.container";
import { CalculatorAttributesContentContext } from "./calculator-attributes.component";
import { getPlaceholder } from "../../utils/mask.util";

const CalculatorAttributesItem = () => {
  const { errors, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, attributes } = useContext(CalculatorAttributesContext);
  const { collectionQueryAttributes, handleToggleCheckbox } = useContext(CalculatorAttributesContentContext);

  const field = `${direction}Attributes`;
  const selectedFields = ["cardNumber", "wallet"]; //"email"

  const clearHyphen = (value) => {
    return value.trim().replace(/-/g, "").replace(/\s+/g, "");
  };

  const handleChangeAttribute = (event) => {
    const { name, value, id } = event.target;
    const elementsIndex = attributes.findIndex((element) => element.name === name);
    const element = attributes.find((element) => element.name === name);
    if (element && element.value !== value) {
      handleToggleCheckbox(true);
      // setSelected("");
    }
    if (elementsIndex === -1) {
      handleChangeRequisitionDetails(
        field,
        attributes.concat({
          id,
          name,
          isHidden: false,
          value: name === "cardNumber" ? clearHyphen(value) : value.trim(),
          information: null
        })
      );
    } else {
      let newArray = [...attributes];
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        value: name === "cardNumber" ? clearHyphen(value) : value.trim()
      };
      handleChangeRequisitionDetails(field, newArray);
    }
  };

  return (
    collectionQueryAttributes &&
    collectionQueryAttributes.map(({ id, fieldType, name, title }) => {
      const element = attributes.find((element) => element.name === name);
      return (
        <React.Fragment key={id}>
          <DelayInputComponent
            id={id}
            type={fieldType}
            name={name}
            label={title}
            value={element ? element.value : ""}
            placeholder={getPlaceholder(name)}
            handleChange={handleChangeAttribute}
            debounceTimeout={600}
            errorMessage={errors[name]}
            required
          />
          {selectedFields.includes(name) && (
            <CalculatorSavedAttributes fieldName={name} />
          )}
        </React.Fragment>
      );
    })
  );
};

export default React.memo(CalculatorAttributesItem);
