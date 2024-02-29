import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min.js";

import { parseIRI } from "../../utils/response.util";
import { getMask, getPlaceholder } from "../../utils/mask.util";

import { GET_ATTRIBUTES } from "../../graphql/queries/attribute.query";

import DelayInputComponent from "../input-group/delay-input-group";
import { StyledButton } from "../styles/styled-button";

const BankDetailsAttributes = ({
  details,
  attributes,
  setAttributes,
  handleChangeRequisitesDetails,
  errors
}) => {
  const { pairUnit, direction, title } = details;
  const { data, loading, error } = useQuery(GET_ATTRIBUTES, {
    fetchPolicy: "network-only",
    variables: { pairUnit_id: parseIRI(pairUnit), direction, locale: "ru" }
  });

  useEffect(() => {
    if (data) {
      const { collectionQueryAttributes } = data;
      if (collectionQueryAttributes.length !== 0) {
        let requisites = [];
        collectionQueryAttributes.map(({ id, fieldType, name, regex }) => {
          // console.log($(`input[name=${name}]`));
          getMask(name) !== "" && $(`input[name=${name}]`).mask(getMask(name));
          if ("hidden" === fieldType)
            requisites.push({
              id,
              name,
              isHidden: true,
              regex,
              value: "",
              information: null
            });
        });
        setAttributes(requisites);
      }
    }
  }, [data]);

  const handleChangeAttribute = (event) => {
    const { name, value, id, pattern } = event.target;
    const elementsIndex = attributes.findIndex((element) => element.id === id);
    if (elementsIndex === -1) {
      setAttributes(
        attributes.concat({
          id,
          name,
          isHidden: false,
          regex: pattern,
          value: value.trim(),
          information: null
        })
      );
    } else {
      let newArray = [...attributes];
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        value: value.trim()
      };
      setAttributes(newArray);
    }
  };

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  if (!data) return <span>Not found.</span>;

  const { collectionQueryAttributes } = data;

  if (!collectionQueryAttributes.length) return <span>No data</span>;

  return (
    <>
      <DelayInputComponent
        type="text"
        name="title"
        label="Name"
        className="bank-details-form__input"
        value={title}
        placeholder="Props"
        errorMessage={errors.title}
        handleChange={(event) =>
          handleChangeRequisitesDetails({ title: event.target.value.trim() })
        }
        debounceTimeout={600}
        required
      />
      {collectionQueryAttributes &&
      collectionQueryAttributes.map(
        ({ id, fieldType, name, title }) => {
          const element = attributes.find((element) => element.name === name);
          return (
            "hidden" !== fieldType && (
              <DelayInputComponent
                id={id}
                key={id}
                type={fieldType}
                name={name}
                label={title}
                className="bank-details-form__input"
                value={element ? element.value : ""}
                placeholder={getPlaceholder(name)}
                handleChange={handleChangeAttribute}
                debounceTimeout={600}
                errorMessage={errors[name]}
                required
              />
            )
          );
        }
      )}
      <StyledButton mb="15" color="main" type="submit">
        Save
      </StyledButton>
    </>
  );
};

export default React.memo(BankDetailsAttributes);