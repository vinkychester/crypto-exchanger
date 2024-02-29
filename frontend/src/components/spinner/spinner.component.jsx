import React from "react";
import { css } from "@emotion/react";
import { PuffLoader } from "react-spinners";

const Spinner = ({ size, color, display, margin }) => {

  const override = css`
    display: ${display};
    margin: ${margin ? margin : "15px auto"};
  `;

  return (
    <PuffLoader css={override} size={size} color={color} loading={true} />
  );
};

export default Spinner;