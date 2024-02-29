import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";

import FilterItemsPerPage from "../../filter-components/filter-items-per-page.component";
import FilterPublish from "./filter/filter-publish.component";

import {
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat
} from "../../../utils/datetime.util";

import { ReviewAdminFilterContext } from "../../../pages/review/review-panel.component";

const ReviewPanelFilter = () => {
  const {filter, handleChangeFilter, handleClearFilter} = useContext(ReviewAdminFilterContext);

  const {firstname, lastname, publish, date_gte, date_lte, itemsPerPage} = filter;

  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || "page" in filter);

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  return (
    <>
      <button onClick={toggleFilter}>Filter</button>
      <FilterItemsPerPage
        name="itemsPerPage"
        value={itemsPerPage}
        handleChangeFilter={handleChangeFilter}
      />
      <label>First Name</label>
      <input
        type="text"
        name="firstname"
        onChange={({ target }) => handleChangeFilter(target.name, target.value.trim())}
        value={firstname ?? ""}
        autoComplete="off"
      />
      <label>Last Name</label>
      <input
        type="text"
        name="lastname"
        onChange={({ target }) => handleChangeFilter(target.name, target.value.trim())}
        value={lastname ?? ""}
        autoComplete="off"
      />
      <FilterPublish
        name="publish"
        value={publish}
        handleChangeFilter={handleChangeFilter}
      />
      <DatePicker
        format="dd-MM-y"
        name="date_gte"
        value={date_gte ? convertDateToLocalDateTime(date_gte) : ""}
        onChange={(date) => handleChangeFilter("date_gte", convertLocalDateTimeToFormat(date))}
      />
      <DatePicker
        format="dd-MM-y"
        name="date_lte"
        value={date_lte ? convertDateToLocalDateTime(date_lte) : ""}
        onChange={(date) => handleChangeFilter("date_lte", convertLocalDateTimeToFormat(date))}
      />
      <button onClick={handleClearFilter}>
        Clear filter
      </button>
    </>
  );
};

export default ReviewPanelFilter;