import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { closableNotificationWithClick } from "../../../notification/closable-notification-with-click.component";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const Code = ({ value }) => {

  return (
    <StyledCardInfoItem data-title="Secret code" className="requisition-data">
      <p className="flow-data__secret-code">
        {value}
        <CopyToClipboard
          text={value}
          onCopy={() => {
            closableNotificationWithClick("Copied", "success");
          }}
        >
          <span className="icon-copy" title="Copy" />
          {/*<Tooltip
            placement="top"
            overlay="Секретный код служит для идентификации личности при встрече с менеджером для наличного обмена"
          >
            <StyledTooltip className="icon-question" opacity="0.5" />
          </Tooltip>*/}
        </CopyToClipboard>
      </p>
    </StyledCardInfoItem>
  );
};

export default Code;
