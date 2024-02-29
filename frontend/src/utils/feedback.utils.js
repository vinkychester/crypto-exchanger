import { feedbackStatusConst } from "./consts.util";

const feedbackStatus = (status) => {
  switch (status) {
    case feedbackStatusConst.NOT_VIEWED: {
      return "Not viewed";
    }
    case feedbackStatusConst.VIEWED: {
      return "Viewed";
    }
    case feedbackStatusConst.WELL_DONE: {
      return "Processed";
    }
    case feedbackStatusConst.DELETED: {
      return "Removed";
    }
  }
};

const author = {
  MANAGER: "admin",
  CLIENT: "client"
};

const authorType = (type) => {
  switch (type) {
    case author.CLIENT: {
      return "Client";
    }
    case author.MANAGER: {
      return "Administrator";
    }
  }
};

export {
  author,
  authorType,
  feedbackStatus,
};