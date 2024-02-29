import { DateTime } from "luxon";

const convertTimestampToDate = (timestamp) => {
  return DateTime.fromMillis(timestamp * 1000).toFormat('dd.MM.yyyy HH:mm');
};

const convertDateToTimestampStart = (date) => {
  return date ? (new Date(date.split('-').reverse().join('-')).setHours(0, 0, 0) / 1000).toString() : "";
};
const convertDateToTimestampEnd = (date) => {
  return date ? (new Date(date.split('-').reverse().join('-')).setHours(23, 59, 59) / 1000).toString() : "";
};

const convertLocalDateTimeToFormat = (date) => {
  return date ? DateTime.fromJSDate(date).toLocaleString() : "";
};

const convertDateToLocalDateTime = (date) => {
  return date ? new Date(Date.parse(date.split('-').reverse().join('-'))) : "";
};

export {
  convertTimestampToDate,
  convertDateToTimestampStart,
  convertDateToTimestampEnd,
  convertLocalDateTimeToFormat,
  convertDateToLocalDateTime
};

