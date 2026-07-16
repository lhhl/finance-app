import { calculateMaturityDate, calculateStatementDate, calculateDaysUntilStatement, calculateDaysUntilMaturity } from "../utils/calculation";
import { formatCurrency, formatDate } from "../utils/format";

export class Fund {
  id: string;
  _name: string;
  _amount: number;
  statement_day?: number;
  maturity_day: number;
  created_at: string;

  constructor(fund: Fund) {
    this.id = fund.id;
    this._name = fund._name;
    this._amount = fund._amount;
    this.statement_day = fund.statement_day;
    this.maturity_day = fund.maturity_day;
    this.created_at = fund.created_at || new Date().toISOString();
  }

  get name(): string {
    return this._name.toUpperCase();
  }

  get amount(): string {
    return formatCurrency(this._amount);
  }

  get maturity_date(): Date {
    return calculateMaturityDate(this.maturity_day);
  }

  get maturity_date_string(): string {
    return formatDate(this.maturity_date);
  }

  get statement_date(): Date | undefined {
    if (!this.statement_day) return undefined;
    return calculateStatementDate(this.statement_day, this.maturity_day - this.statement_day, this.maturity_date!);
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
