import { calculateMaturityDate, calculateStatementDate, calculateDaysUntilStatement, calculateDaysUntilMaturity } from "../utils/calculation";
import { formatCurrency, formatDate } from "../utils/format";
import { Debt } from "./debt";

export class Contact {
  id: number;
  name: string;
  debts: Debt[] = [];

  constructor(contact: Contact) {
    this.id = contact.id;
    this.name = contact.name;
    this.debts = contact.debts ? contact.debts.map(debt => new Debt(debt)) : [];
  }

  get totalDebtAmount(): number {
    if (!this.debts?.length) return 0;
    return this.debts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  get formatedTotalDebtAmount(): string {
    return formatCurrency(this.totalDebtAmount);
  }

  allocateDebtPayment(amount: number): { debtId: number; fundName: string; currentAmount: number; newAmount: number; status: string }[] {
    let remainingAmount = amount;
    const allocations: { debtId: number; fundName: string; currentAmount: number; newAmount: number; status: string }[] = [];
    const filterdDebts = this.debts.filter(debt => debt.isInCurrentStatementPeriod);
    const sortedDebts = filterdDebts.sort((a, b) => a.untilMaturityDays! - b.untilMaturityDays!);

    for (const debt of sortedDebts) {
      // if (remainingAmount <= 0) break;

      const paymentAmount = Math.min(debt.amount, remainingAmount);
      allocations.push({ debtId: debt.id, fundName: debt.funds ? debt.funds.name : '', currentAmount: debt.amount, newAmount: debt.amount - paymentAmount, status: debt.funds ? `(${debt.funds.maturityDayStatus})` : '' });
      remainingAmount -= paymentAmount;
    }

    return allocations;
  }
}
