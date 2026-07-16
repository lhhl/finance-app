
import { Fund } from "../../models/fund";
import { formatCurrency, formatDate } from "../../utils/format";
import { AddFundRequest } from "../../models/add-fund-request";
import { ValidationError } from "validate";

export const NO_FUNDS = "Không có nguồn tiền nào!";
export function createFundMessage(fundModel: Fund, no: number): string {
  const template = `${no}. <b>${fundModel.name}</b>
  - Hạn mức: <b>${fundModel.amount}</b>
  ${fundModel.statement_date_string ? `- Ngày sao kê: <b>${fundModel.statement_date_string}</b>` : ""}
  - Ngày đáo hạn: <b>${fundModel.maturity_date_string}</b>
  <b>${fundModel.status}</b>
-------------------`;
  return template;
}
export function createAddFundMessage(): string {
  return `📝 Vui lòng nhập thông tin cho nguồn tiền mới theo thứ tự sau:
1. Tên nguồn tiền
2. Hạn mức (số tiền)
3. Ngày đáo hạn
4. Ngày sao kê (nếu có)
5. Khoảng cách các kỳ sao kê (tháng - mặc định là 1)`;
}

export function createConfirmAddFundMessage(data: AddFundRequest): string {
  return `⚡ Vui lòng xác nhận thông tin cho nguồn tiền mới:
1. Tên nguồn tiền: ${data.name}
2. Hạn mức (số tiền): ${data.amount}
3. Ngày đáo hạn: ${data.maturity_day}
4. Ngày sao kê (nếu có): ${data.statement_day ?? "Không có"}
5. Khoảng cách các kỳ sao kê (tháng - mặc định là 1): ${data.interval_months ?? 1}`;
}

export function createErrorInputMessage(errors: ValidationError[]): string {
  return `‼️ Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại các thông tin sau:
  - ${errors.map(e => `${e.path}`).join("\n  - ")}`;
}

export function createCancelActionMessage(name: string): string {
  return `⚠️ Đã hủy thao tác ${name}.`;
}

export function createErrorMessage(): string {
  return "❌ Đã xảy ra lỗi. Vui lòng thử lại.";
}

export function createSuccessMessage(name: string): string {
  return `✅ Thao tác ${name} đã thành công!`;
}