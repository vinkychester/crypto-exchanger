import React, { useEffect, useState } from "react";
import Switch from "rc-switch";

import { StyledActiveToggler, StyledSwitchLabel } from "./styled-active-toggler";

const ActiveToggler = ({ id, name, value, text, action, loading, error, label, className, title }) => {
  const [checked, setChecked] = useState(value);

  const handleToggleActivity = () => {
    action({ variables: { id, [name]: !checked } });
    setChecked(!checked);
  };
  useEffect(() => {
      setChecked(value === true);
    }, [value]
  );

  return (
    <StyledActiveToggler className={className} title={title}>
      {label && <StyledSwitchLabel>{label}:</StyledSwitchLabel>}
      <Switch
        className="default-switch"
        name="active"
        checked={checked}
        defaultChecked={checked}
        onClick={handleToggleActivity}
      />
      {loading && <span>loading</span>}
      {error && <p>Error :( Please try again</p>}
    </StyledActiveToggler>
  )
}

export default ActiveToggler;