
import { Fund } from "../models/fund";
import { formatCurrency } from "./format";
import { AddFundRequest } from "../models/add-fund-request";
import type { ValidationError } from "../types/error";
import { Debt } from "../models/debt";
import { Contact } from "../models/contact";
import { SelectOption } from "../types/select-option";
import { FeeCharge } from "../models/fee-charges";

export function createMatureFundListMessage(funds: Fund[]): string {
  const template = `💸 Các nguồn tiền sắp đến hạn:
______________________\n
${funds.map((fund, i) => `  📆 <b>${fund.formatedName}</b>: ${fund.formatedTotalStatementDebtAmount} (${fund.maturityDayStatus})`).join("\n")}`;
  return template;
}

export function createFundOverview(totalAvailable: string, totalDebt: string, totalDebtInStatement: string): string {
  const template = `📣 Thống kê nguồn tiền:
  💶 Tổng khả dụng: <b>${totalAvailable}</b>
  💸 Tổng nợ: <b>${totalDebt}</b>
  📆 Tổng nợ đến hạn: <b>${totalDebtInStatement}</b>`;
  return template;
}

export function createFundListMessage(funds: Fund[]): string {
  const template = funds.map(fund => `💵 <b>${fund.formatedName}</b>
  📆 Dư nợ: <b>${fund.formatedTotalDebtAmount}</b>
  💸 Sao kê: <b>${fund.formatedTotalStatementDebtAmount}</b>
  💶 Khả dụng: <b>${fund.formatedAvailableAmount}</b>
  <b>${fund.status}</b>
______________________\n`).join("\n");
  return template;
}

export function createFundDetailMessage(fund: Fund): string {
  const template = `💵 <b>${fund.formatedName}</b>
  🪎 Hạn mức: <b>${fund.formatedAmount}</b>
  💶 Còn lại: <b>${fund.formatedAvailableAmount}</b>
  ${fund.statementDateString ? `🗓️ Ngày sao kê: <b>${fund.statementDateString}</b>` : ""}
  🗓️ Ngày đáo hạn: <b>${fund.maturityDateString}</b>
  📆 Sao kê kỳ này: <b>${fund.formatedTotalStatementDebtAmount}</b>
  <b>${fund.status}</b>
${fund.debts!.length > 0 ? `______________________\n
  💸 Tổng các khoản vay: <b>${fund.formatedTotalDebtAmount}</b>
${fund.debts!.map((debt) => `   👤 ${debt.debt_contacts!.name}: <b>${debt.formatedAmount}</b> (${debt.createdAtString})`).join("\n")}` : ''}`;
  return template;
}

export function createChargeFeeMessage(contacts: Contact[]): string {
  const template = `📒 Các khoản nợ phí:
______________________\n
${contacts.map(contact => `👤 ${contact.name}: <b>${contact.formatedTotalFeeChargeAmount}</b>
${contact.fee_charges.map(feeCharge => `   🔸 <b>${feeCharge.formatedAmount}</b>: ${feeCharge.formatedMaturityDate} (${feeCharge.funds?.formatedName})`).join("\n")}
______________________
`).join("\n")}`;
  return template;
}

export function createContactDebtMessage(contacts: Contact[]): string {
  const template = contacts.map(contact => `👤 ${contact.name}: <b>${contact.formatedTotalDebtAmount}</b>`).join("\n");
  return template;
}

export function createAddFundMessage(): string {
  return `📝 Vui lòng nhập thông tin cho nguồn tiền mới theo thứ tự sau:
1. Tên nguồn tiền
2. Hạn mức (số tiền)
3. Ngày đáo hạn
4. Ngày sao kê`;
}

export function createEditFundMessage(fund: Fund): string {
  return `📝 Vui lòng sửa thông tin cho nguồn tiền mới theo thứ tự sau:
1. Tên nguồn tiền <b>[${fund.formatedName}]</b>
2. Hạn mức (số tiền) <b>${fund.formatedAmount}</b>
3. Ngày đáo hạn <b>[${fund.maturityDate}]</b>
4. Ngày sao kê <b>[${fund.statementDate}]</b>`;
}

export function createFundRefinanceMessage(fund: Fund): string {
  const template = `💵 <b>${fund.formatedName}</b>
  🪎 Hạn mức: <b>${fund.formatedAmount}</b>
  💸 Tổng nợ vay: <b>${fund.formatedTotalDebtAmount}</b>
  💶 Còn lại: <b>${fund.formatedAvailableAmount}</b>
  <b>${fund.status}</b> (${fund.maturityDateString})
  📣 Nguồn tiền sẽ được đáo hạn với phí <b>${fund.refinance_percent}%</b>: ${fund.formatedRefinanceFeeString}
${fund.statementDebts.length > 0 ? `______________________\n
  💸 Các khoản vay trong sao kê: <b>${fund.formatedTotalStatementDebtAmount}</b>
${fund.statementDebts!.map((debt) => `      👤 ${debt.debt_contacts!.name}: <b>${debt.formatedAmount}</b> (${debt.createdAtString}) - Phí: <b>${debt.formatedRefinanceFeeString}</b>`).join("\n")}` : ''}`;
  return template;
}

export function createSettingMessage(key: string, value: string): string {
  const template = `⚙️ Thiết lập ${key} hiện tại: <b>${value}</b>`;
  return template;
}

export function createInputMessage(name: string): string {
  return `📝 Vui lòng nhập ${name}`;
}

export function createSelectMessage(name: string): string {
  return `🔎 Vui lòng chọn ${name}`;
}

export function createSelectOptionMessage(name: string, options: SelectOption[]): string {
  return `🔎 Vui lòng nhập số thứ tự ${name}:
______________________\n
${options.map((option, i) => `${i + 1}. ${option.name}`).join("\n")}`;
}

export function createAvailFundsMessage(funds: Fund[]): string {
  return `✳️ Các nguồn tiền khả dụng:
______________________\n
${funds.map((fund, i) => `${i + 1}. <b>${fund.formatedName}</b> - <b>${fund.formatedAvailableAmount}</b>: ${fund.statementDaysStatus}`).join("\n")}`;
}

export function createSelectFundMessage(funds: Fund[]): string {
  return `🔎 Vui lòng chọn số thứ tự nguồn tiền:
______________________\n
${funds.map((fund, i) => `${i + 1}. ${fund.formatedName}`).join("\n")}`;
}

export function createSelectContactMessage(contacts: Contact[]): string {
  return `🔎 Vui lòng chọn số thứ tự người vay:
______________________\n
${contacts.map((contact, i) => `${i + 1}. ${contact.name}`).join("\n")}`;
}

export function createConfirmAddFundMessage(data: AddFundRequest): string {
  return `⚡ Vui lòng xác nhận thông tin cho nguồn tiền mới:
1. Tên nguồn tiền: <b>${data.name}</b>
2. Hạn mức (số tiền): <b>${formatCurrency(data.amount)}</b>
3. Ngày đáo hạn: <b>${data.maturity_day}</b>
4. Ngày sao kê: <b>${data.statement_day}</b>`;
}

export function createAllocationDebtMessage(contact: Contact, allocations: { debtId: number; fundName: string; currentAmount: number; newAmount: number; status: string }[]): string {
  const template = `💸 Vui lòng xác nhận phân bổ thanh toán cho <b>${contact.name}</b>:
______________________\n
${allocations.map((allocation, i) => {
    return `   👤 ${allocation.fundName}: <b>${formatCurrency(allocation.currentAmount)}</b> -> <b>${formatCurrency(allocation.newAmount)}</b> ${allocation.status}`;
  }).join("\n")}`;
  return template;
}

export function createInvalidInputMessage(): string {
  return `‼️ Dữ liệu nhập không hợp lệ`;
}

export function createErrorInputMessage(errors: ValidationError[]): string {
  return `‼️ Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại các thông tin sau:
  - ${errors.map(e => `${e.message}`).join("\n  - ")}`;
}

export function createCancelActionMessage(name: string): string {
  return `⚠️ Đã hủy lệnh ${name}.`;
}

export function createErrorMessage(message: string): string {
  return `❌ Đã xảy ra lỗi trong thao tác: ${message}. Vui lòng thử lại.`;
}

export function createSuccessMessage(name: string): string {
  return `✅ Thao tác ${name} đã thành công!`;
}

export function createNotFoundMessage(name: string): string {
  return `⛓️‍💥 Không tìm thấy ${name}.`;
}

export function createConfirmMessage(name: string): string {
  return `❓ Bạn có muốn ${name}?`;
}

export function createInvalidCommandMessage(): string {
  return `⛔ Vui lòng hoàn thành tiến trình hiện tại trước khi thực hiện lệnh mới.`;
}

export function createNoActiveFlowMessage(): string {
  return `⛔ Không thể thực hiện thao tác này khi không có tiến trình nào đang diễn ra.`;
}