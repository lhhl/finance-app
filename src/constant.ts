export const STATEMENT_INTERVAL_MONTHS = 1;
export const BUFFER_MATURITY_DAYS = 0;
export const CHAT_STATE_EXPIRATION_MINUTES = 30;
export enum FLOW_COMMANDS {
  LIST_FUND = "/nguontien",
  ADD_FUND = "/themnguontien",
  EDIT_FUND = "/suanguontien",
  DELETE_FUND = "/xoanguontien",
}

export enum CALLBACK_COMMANDS {
  CONFIRM = "@xacnhan",
  CANCEL = "@huy",
}