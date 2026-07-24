import { calculateMaturityDate, calculateDaysUntilMaturity } from "../utils/calculation";
import { formatCurrency, formatDate } from "../utils/format";
import { Fund } from "./fund";
import { Contact } from "./contact";
import { FeeCharge } from "./fee-charges";

export class Debt {
  id: number;
  amount: number;
  funds?: Fund;
  debt_contacts?: Contact;
  created_at: Date;

  constructor(debt: Debt) {
    this.id = debt.id;
    this.amount = debt.amount;
    this.funds = debt.funds ? new Fund(debt.funds) : undefined;
    this.debt_contacts = debt.debt_contacts ? new Contact(debt.debt_contacts) : undefined;
    this.created_at = new Date(debt.created_at);
  }

  get refinanceFee(): number {
    if (!this.funds) return 0;
    return this.amount * (this.funds.refinance_percent / 100);
  }

  get formatedRefinanceFeeString(): string {
    return formatCurrency(this.refinanceFee);
  }

  get formatedAmount(): string {
    return formatCurrency(this.amount);
  }

  get maturityDate(): Date | undefined {
    if (!this.funds) return undefined;
    return calculateMaturityDate(this.funds.maturity_day);
  }

  get isInCurrentStatementPeriod(): boolean | undefined {
    if (!this.funds) return undefined;
    return this.created_at < this.funds.statementDate;
  }

  get maturityDateString(): string | undefined {
    if (!this.maturityDate) return undefined;
    return formatDate(this.maturityDate);
  }

  get untilMaturityDays(): number | undefined {
    if (!this.maturityDate) return undefined;
    return calculateDaysUntilMaturity(this.maturityDate);
  }

  get createdAtString(): string {
    return formatDate(this.created_at);
  }

  get status(): string {
    if (this.untilMaturityDays === undefined) {
      return '';
    } else if (this.untilMaturityDays > 0) {
      return `🔵 Còn ${this.untilMaturityDays} ngày đến ngày thanh toán`;
    } else if (this.untilMaturityDays === 0) {
      return "🔴 Đến hạn hôm nay";
    } else {
      return "🟢 Đã thanh toán";
    }
  }

}
