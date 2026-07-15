
import { FundModel } from "../../models/fund";
import { formatCurrency, formatDate } from "../../utils/format";
import { AddFundRequest } from "../../types/fund";

export const NO_FUNDS = "Không có nguồn tiền nào!";
export function createFundMessage(fundModel: FundModel, no: number): string {
  const template = `${no}. <b>${fundModel.name}</b>
  - Hạn mức: <b>${fundModel.amount}</b>
  ${fundModel.statement_date_string ? `- Ngày sao kê: <b>${fundModel.statement_date_string}</b>` : ""}
  - Ngày đáo hạn: <b>${fundModel.maturity_date_string}</b>
  <b>${fundModel.status}</b>
-------------------`;
  return template;
}
export function createAddFundMessage(): string {
  return `Vui lòng nhập thông tin cho nguồn tiền mới theo thứ tự sau:
1. Tên nguồn tiền
2. Hạn mức (số tiền)
3. Ngày đáo hạn
4. Ngày sao kê (nếu có)
5. Khoảng cách các kỳ sao kê (tháng - mặc định là 1)`;
}

export function createConfirmAddFundMessage(data: AddFundRequest): string {
  return `Vui lòng xác nhận thông tin cho nguồn tiền mới:
1. Tên nguồn tiền: ${data.name}
2. Hạn mức (số tiền): ${data.amount}
3. Ngày đáo hạn: ${data.maturity_day}
4. Ngày sao kê (nếu có): ${data.statement_day ?? "Không có"}
5. Khoảng cách các kỳ sao kê (tháng - mặc định là 1): ${data.interval_months ?? 1}`;
}