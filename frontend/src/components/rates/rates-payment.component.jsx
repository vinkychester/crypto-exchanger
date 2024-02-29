import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import Select, { Option } from "rc-select";
import SelectSkeleton from "../skeletons/skeleton-select";
import AlertMessage from "../alert/alert.component";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-select";

import { GET_FIAT_RATES_PAIR_UNIT } from "../../graphql/queries/pair-unit.query";
import { RatesContext } from "./rates.component";
import { deleteDuplicates } from "../../utils/pairUnits.util";

const RatesPayment = () => {
  const { selected, handleChangeSelected, handleChangeReserve } = useContext(RatesContext);

  const __reserve = (collection, direction) => {
    let result = collection.find((item) => item.direction === direction);
    if (result) {
      const { min, max } = result.fee;
      let obj =
        direction === "payment"
          ? { inmin: min, inmax: max }
          : { outmin: min, outmax: max };
      handleChangeReserve({ ...obj });
    }
  };

  const { data, loading, error } = useQuery(GET_FIAT_RATES_PAIR_UNIT, {
    fetchPolicy: "network-only",
    onCompleted: ({ pairUnits }) => {
      const { collection } = pairUnits;
      if (collection.length !== 0) {
        // set payment reserve
        __reserve(collection, "payment");
        // set payout reserve
        __reserve(collection, "payout");

        handleChangeSelected(deleteDuplicates(collection)[0]);
      }
    }
  });

  const handleChange = (value, { label }) => {
    handleChangeSelected(label);
  };

  if (loading || Object.keys(selected).length === 0)
    return (
      <SelectSkeleton className="choose-direction" optionWidth="55" label="Choose direction" />
    );
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.pairUnits;

  if (!collection.length) return <AlertMessage type="warning" message="no payment systems" />;

  const filtered = deleteDuplicates(collection);

  return (
    <StyledSelect className="choose-direction">
      <StyledSelectLabel>Choose direction:</StyledSelectLabel>
      <Select
        className="custom-select"
        defaultValue={selected?.paymentSystem?.name + selected?.currency?.asset}
        onChange={handleChange}
      >
        {filtered &&
        filtered.map((item) => {
          const { paymentSystem, currency, id } = item;
          return (
            <Option
              key={id}
              value={`${paymentSystem.name}${currency.asset}`}
              label={item}
            >
              <div className="option-select-item option-select-item_with-img">
                <span
                  role="img"
                  className={`exchange-icon-${paymentSystem.tag}`}
                  aria-label={`${currency.tag}`}
                />
                <b>{paymentSystem.name}</b>{currency.asset}
              </div>
            </Option>
          );
        })}
      </Select>
    </StyledSelect>
  );
};

export default React.memo(RatesPayment);
