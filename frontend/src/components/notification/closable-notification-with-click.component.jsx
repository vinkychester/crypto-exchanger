import React from "react";
import Notification from "rc-notification";

// import "rc-notification/assets/index.css";

let notification = null;
Notification.newInstance({ maxCount: 1 }, (n) => notification = n);

export const closableNotificationWithClick = (message, type) => {

  const key = Date.now();

  const close = (key) => {
    notification.removeNotice(key);
  };

  const closeAfterClick = () => {
    document.addEventListener("click", function (e) {
      if (e.target.id !== "closableNotification") {
        close(key);
      }
    });
  }

  setTimeout(closeAfterClick, 1000)

  notification.notice({
    content: <span id="closableNotification" className={`message-with-icon ${type}`}>{message}</span>,
    duration: null,
    closable: true,
    key
  });
};