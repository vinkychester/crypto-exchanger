import React, { useState } from "react";
import AlertMessage from "../../../alert/alert.component";
import { closableNotificationWithClick } from "../../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { StyledCardInfoItem } from "../../../styles/styled-card";

const BlockchainUrl = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  return (
    <>
      {regex.test(value) ? (
        <StyledCardInfoItem data-title="Link to blockchain" className="requisition-data">
          <p>
            <a
              href={value}
              className="default-link"
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
            <CopyToClipboard
              text={value}
              onCopy={() => {
                setCopied(true);
                closableNotificationWithClick("Copied", "success");
              }}
            >
              <span className="icon-copy" title="Copy" />
            </CopyToClipboard>
          </p>
        </StyledCardInfoItem>
      ) : (
        <AlertMessage
          type="info"
          message={value}
        />
      )}
    </>
  );
};

export default BlockchainUrl;
