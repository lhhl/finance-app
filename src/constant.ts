export const STATEMENT_INTERVAL_MONTHS = 1;
export const BUFFER_MATURITY_DAYS = 3;
export const CHAT_STATE_EXPIRATION_MINUTES = 30;
export const NOTIFY_MATURITY_DAYS_IN_DAYS = 5;
export const SETTING_KEYS = {
  CHARGE_FEE_PERCENT: "charge_fee_percent",
}

export enum FLOW_COMMANDS {
  LIST_FUND = "/nguontien",
  ADD_FUND = "/themnguontien",
  EDIT_FUND = "/suanguontien",
  DETAIL_FUND = "/chitietnguontien",
  DELETE_FUND = "/xoanguontien",
  DETAIL_DEBT = "/chitietkhoanvay",
  DEBT_ALLOCATION = "/chovay",
  VIEW_CHARGE_FEE = "/phicathe",
  CHANGE_CHARGE_FEE = "/doiphicathe",
  REFINANCE_FUND = "/daohan",
  LIST_CONTACT_DEBTS = "/khoanvay",
  PAY_DEBT = "/thanhtoanvay",
}

export enum CALLBACK_COMMANDS {
  CONFIRM = "^xacnhan",
  CANCEL = "^huy",
  EXIT = "^thoat",
  RETRY = "^thulai",
}