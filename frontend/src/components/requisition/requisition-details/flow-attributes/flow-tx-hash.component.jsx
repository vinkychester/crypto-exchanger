import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { closableNotificationWithClick } from "../../../notification/closable-notification-with-click.component";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const TxHash = ({ value }) => {

  return (
    <StyledCardInfoItem data-title="TX Hash" className="requisition-data">
      <p>
        {value}
        <CopyToClipboard
          text={value}
          onCopy={() => {
            closableNotificationWithClick("Copied", "success");
          }}
        >
          <span className="icon-copy" title="Copy" />
        </CopyToClipboard>
      </p>
    </StyledCardInfoItem>
  );
};

export default TxHash;
