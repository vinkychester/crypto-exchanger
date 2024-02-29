import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import { closableNotificationWithClick } from "../../../notification/closable-notification-with-click.component";

import { StyledCardInfoItem } from "../../../styles/styled-card";
import { requisitionStatusConst } from "../../../../utils/consts.util";

const Address = ({ value, requisitionStatus }) => {

  if (requisitionStatus === requisitionStatusConst.ERROR) return <></>;

  return (
    <StyledCardInfoItem data-title="System details for payment (crypto wallet)" className="requisition-data">
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
      <QRCode
        size={200}
        bgColor="transparent"
        fgColor="#121026"
        className="requisition-data__qrcode"
        value={value}
      />
    </StyledCardInfoItem>
  );
};

export default Address;
