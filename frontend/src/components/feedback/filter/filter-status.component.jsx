import React from "react";
import Select, { Option } from "rc-select";

import { feedbackStatus } from "../../../utils/feedback.utils";
import { feedbackStatusConst } from "../../../utils/consts.util";

const FilterStatus = ({ name, value, handleChangeFilter }) => {
  return (
    <>
      <label>Status</label>
      <Select
        name={name}
        value={value ?? null}
        defaultValue={null}
        onChange={(value) => handleChangeFilter(name, value)}
      >
        <Option value={null}>All</Option>
        <Option value={feedbackStatusConst.NOT_VIEWED}>
          {feedbackStatus(feedbackStatusConst.NOT_VIEWED)}
        </Option>
        <Option value={feedbackStatusConst.VIEWED}>
          {feedbackStatus(feedbackStatusConst.VIEWED)}
        </Option>
        <Option value={feedbackStatusConst.WELL_DONE}>
          {feedbackStatus(feedbackStatusConst.WELL_DONE)}
        </Option>
        <Option value={feedbackStatusConst.DELETED}>
          {feedbackStatus(feedbackStatusConst.DELETED)}
        </Option>
      </Select>
    </>
  );
};

export default React.memo(FilterStatus);