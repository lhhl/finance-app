import { calculateMaturityDate, calculateStatementDate, calculateDaysUntilStatement, calculateDaysUntilMaturity } from "../utils/calculation";
import { formatCurrency, formatDate } from "../utils/format";
import { Debt } from "./debt";
import { Contact } from "./contact";
import { FeeCharge } from "./fee-charges";
import { AddFeeChargeRequest } from "./add-fee-charge-request";

export class Fund {
  id: number;
  name: string;
  amount: number;
  statement_day: number;
  maturity_day: number;
  created_at: Date;
  month_interval?: number;
  refinance_date?: Date;
  refinance_percent: number = 0;
  debts?: Debt[];

  constructor(fund: Fund) {
    this.id = fund.id;
    this.name = fund.name;
    this.amount = fund.amount;
    this.statement_day = fund.statement_day;
    this.maturity_day = fund.maturity_day;
    this.created_at = new Date(fund.created_at);
    this.month_interval = fund.month_interval;
    this.debts = fund.debts ? fund.debts.map(debt => new Debt(debt)) : [];
    this.refinance_date = fund.refinance_date ? new Date(fund.refinance_date) : undefined;
  }

  get canRefinance(): boolean {
    return this.totalStatementDebtAmount > 0 && this.untilStatementDays < 0;
  }

  isAvailableForAmount(amount: number): boolean {
    return this.avalableAmount >= amount && this.untilStatementDays < 0;
  }

  get refinanceFee(): number {
    return this.totalStatementDebtAmount * (this.refinance_percent / 100);
  }

  get formatedRefinanceFeeString(): string {
    return formatCurrency(this.refinanceFee);
  }

  get isRefinanced(): boolean {
    if (!this.refinance_date) return false;
    return this.refinance_date > this.statementDate;
  }

  get formatedName(): string {
    return this.name.toUpperCase();
  }

  get formatedAmount(): string {
    return formatCurrency(this.amount);
  }

  get formatedAvalableAmount(): string {
    return formatCurrency(this.avalableAmount);
  }

  get formatedTotalStatementDebtAmount(): string {
    return formatCurrency(this.totalStatementDebtAmount);
  }

  get formatedTotalDebtAmount(): string {
    return formatCurrency(this.totalDebtAmount);
  }

  get avalableAmount(): number {
    return this.amount - this.totalDebtAmount;
  }

  get statementDebts(): Debt[] {
    if (!this.debts) return [];
    return this.debts.filter(debt => debt.created_at < this.statementDate);
  }

  get totalStatementDebtAmount(): number {
    if (!this.statementDebts.length) return 0;
    return this.statementDebts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  get totalDebtAmount(): number {
    if (!this.debts?.length) return 0;
    return this.debts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  get maturityDate(): Date {
    return calculateMaturityDate(this.maturity_day);
  }

  get maturityDateString(): string {
    return formatDate(this.maturityDate);
  }

  get statementDate(): Date {
    return calculateStatementDate(this.statement_day, this.maturity_day - this.statement_day, this.maturityDate!);
  }

  get statementDateString(): string {
    return formatDate(this.statementDate);
  }

  get untilStatementDays(): number {
    return calculateDaysUntilStatement(this.statementDate);
  }

  get untilMaturityDays(): number {
    return calculateDaysUntilMaturity(this.maturityDate);
  }

  get maturityDayStatus(): string {
    if (this.untilMaturityDays > 0) {
      return `Còn ${this.untilMaturityDays} ngày đến đáo hạn`;
    }
    if (this.untilMaturityDays === 0) {
      return "Đáo hạn hôm nay";
    }
    return `Đã quá hạn ${-this.untilMaturityDays} ngày`;
  }

  get status(): string {
    if (this.untilStatementDays < 0) {
      if (this.isRefinanced) {
        return "🟢 Đã đáo hạn";
      }
      if (this.totalStatementDebtAmount == 0) {
        return `🟤 Không cần đáo hạn`;
      }
      if (this.untilMaturityDays > 0) {
        return `🔵 Còn ${this.untilMaturityDays} ngày đến đáo hạn`;
      } else if (this.untilMaturityDays === 0) {
        return "🔴 Đáo hạn hôm nay";
      } else {
        return "🟣 Đã quá hạn";
      }
    }
    if (this.untilStatementDays === 0) {
      return "🟠 Sao kê hôm nay";
    }
    return `🟡 Còn ${this.untilStatementDays} ngày đến sao kê`;
  }

  get statementDaysStatus(): string {
    if (this.untilStatementDays > 0) {
      return `Chưa đến sao kê`;
    }
    if (this.untilStatementDays === 0) {
      return "Sao kê hôm nay";
    }
    return `Sao kê ${-this.untilStatementDays} ngày trước`;
  }

  get debtFeeChargeRequests(): AddFeeChargeRequest[] {
    return this.debts?.map(debt => ({
      amount: debt.refinanceFee,
      debt_id: debt.id,
      fund_id: this.id,
      contact_id: debt.debt_contacts?.id || 0,
      maturity_date: this.maturityDate,
    })) || [];
  }
}
