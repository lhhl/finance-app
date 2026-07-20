import { FLOW_COMMANDS } from "../../../constant";
import { ChangeChargeFeeFlow } from "./setting/change-charge-fee-flow";
import { FundListFlow } from "./fund/fund-list-flow";
import { AddFundFlow } from "./fund/add-fund-flow";
import { EditFundFlow } from "./fund/edit-fund-flow";
import { DetailFundFlow } from "./fund/detail-fund-flow";
import { DebtAllocationFlow } from "./debt/debt-allocation-flow";
import { ViewChargeFeeFlow } from "./setting/view-charge-fee-flow";
import { RefinanceFundFlow } from "./fund/refinance-fund-flow";
import { ContactDebtListFlow } from "./contact/contact-debt-list-flow";

export const FLOW_COMMANDS_LIST = {
  [FLOW_COMMANDS.LIST_FUND]: FundListFlow,
  [FLOW_COMMANDS.ADD_FUND]: AddFundFlow,
  [FLOW_COMMANDS.EDIT_FUND]: EditFundFlow,
  [FLOW_COMMANDS.DETAIL_FUND]: DetailFundFlow,
  // [FLOW_COMMANDS.DELETE_FUND]: FundFlow,
  [FLOW_COMMANDS.DEBT_ALLOCATION]: DebtAllocationFlow,
  [FLOW_COMMANDS.VIEW_CHARGE_FEE]: ViewChargeFeeFlow,
  [FLOW_COMMANDS.CHANGE_CHARGE_FEE]: ChangeChargeFeeFlow,
  [FLOW_COMMANDS.REFINANCE_FUND]: RefinanceFundFlow,
  [FLOW_COMMANDS.LIST_CONTACT_DEBTS]: ContactDebtListFlow,
  [FLOW_COMMANDS.PAY_DEBT]: ContactDebtListFlow,
};

export const FLOW_CUD = {
  [FLOW_COMMANDS.LIST_FUND]: {
    add: FLOW_COMMANDS.ADD_FUND,
    edit: FLOW_COMMANDS.EDIT_FUND,
    delete: FLOW_COMMANDS.DELETE_FUND,
    detail: FLOW_COMMANDS.DETAIL_FUND,
  },
}