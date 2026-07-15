import { Fund } from "../types/fund";
import { calculateDaysUntilMaturity, calculateDaysUntilStatement, calculateMaturityDate, calculateStatementDate } from "../utils/calculation";
import { formatCurrency, formatDate } from "../utils/format";

export class FundModel {
  fund: Fund;

  constructor(fund: Fund) {
    this.fund = fund;
  }

  get name(): string {
    return this.fund.name.toUpperCase();
  }

  get amount(): string {
    return formatCurrency(this.fund.amount);
  }

  get maturity_date(): Date {
    return calculateMaturityDate(this.fund.maturity_day);
  }

  get maturity_date_string(): string {
    return formatDate(this.maturity_date);
  }

  get statement_date(): Date | undefined {
    if (!this.fund.statement_day) return undefined;
    return calculateStatementDate(this.fund.statement_day, this.fund.maturity_day - this.fund.statement_day, this.maturity_date!);
  }

  get statement_date_string(): string | undefined {
    if (!this.statement_date) return undefined;
    return formatDate(this.statement_date);
  }

  get until_statement_days(): number | undefined {
    if (!this.statement_date) return undefined;
    return calculateDaysUntilStatement(this.statement_date);
  }

  get until_maturity_days(): number {
    return calculateDaysUntilMaturity(this.maturity_date);
  }

  get status(): string {
    if (this.until_statement_days == undefined || this.until_statement_days <= 0) {
      if (this.until_maturity_days > 0) {
        return `🔵 Còn ${this.until_maturity_days} ngày đến ngày đáo hạn`;
      } else if (this.until_maturity_days === 0) {
        return "🔴 Đáo hạn hôm nay";
      } else {
        return "🟢 Đã đáo hạn";
      }
    }
    return `🟡 Còn ${this.until_statement_days} ngày đến ngày sao kê`;
  }
}