import React, { useContext } from "react";

import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterStatus from "../filter/filter-status.component";

import { FeedbackFilterContext } from "../../../pages/feedback/feedback.component";

import { handleChange } from "../../../utils/filter.util";

const FeedbackFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(FeedbackFilterContext);

  const { firstname, lastname, email, status, itemsPerPage } = filter;
  console.log(filter);

  return (
    <>
      <button>Filter</button>
      <FilterItemsPerPage
        name="itemsPerPage"
        value={itemsPerPage}
        handleChangeFilter={handleChangeFilter}
      />
      <label>First Name</label>
      <input
        type="text"
        name="firstname"
        onChange={((e) => handleChange(e, handleChangeFilter))}
        value={firstname ?? ""}
        autoComplete="off"
      />
      <label>Last Name</label>
      <input
        type="text"
        name="lastname"
        onChange={((e) => handleChange(e, handleChangeFilter))}
        value={lastname ?? ""}
        autoComplete="off"
      />
      <label>Last Name</label>
      <input
        type="text"
        name="email"
        onChange={((e) => handleChange(e, handleChangeFilter))}
        value={email ?? ""}
        autoComplete="off"
      />
      <FilterStatus
        name="status"
        value={status}
        handleChangeFilter={handleChangeFilter}
      />
      <button onClick={handleClearFilter}>
        Clear filter
      </button>
    </>
  );
};

export default React.memo(FeedbackFilter);