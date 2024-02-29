import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import RateItem from "./rates-item.component";

import { StyledTableHead } from "../styles/styled-card";

import { GET_CRYPTO_RATES_PAIR_UNIT } from "../../graphql/queries/pair-unit.query";
import { RatesContext } from "./rates.component";
import { parseIRI } from "../../utils/response.util";
import { deleteDuplicates } from "../../utils/pairUnits.util";
import AlertMessage from "../alert/alert.component";

const RatesList = () => {
  const history = useHistory();
  const { selected } = useContext(RatesContext);

  const [array, setArray] = useState({});

  const { data, loading, error, refetch } = useQuery(GET_CRYPTO_RATES_PAIR_UNIT, {
    variables: { selected: parseIRI(selected.id) },
    fetchPolicy: "network-only",
    onCompleted: ({ cryptoCollectionPairUnits }) => {
      const { collection } = cryptoCollectionPairUnits;
      if (collection.length !== 0) {
        setArray(collection);
      }
    }
  });

  if (loading) return "loading...";
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.cryptoCollectionPairUnits;

  if (!collection.length) return "No payment systems";

  const filtered = deleteDuplicates(collection);

  return (
    <>
      <StyledTableHead col="4" className="rate-head">
        <ul className="table-head">
          <li className="table-head__item">
            Name and abbreviation
          </li>
          <li className="table-head__item">
            24H Change
          </li>
          <li className="table-head__item">
            Purchase
          </li>
          <li className="table-head__item">
            Sale
          </li>
        </ul>
      </StyledTableHead>
      {filtered && filtered.map(({ id, ...props }) => (
        Object.keys(array).length !== 0 && <RateItem key={id} id={id} {...props} array={array} />
      ))}
    </>
  );
};

export default React.memo(RatesList);