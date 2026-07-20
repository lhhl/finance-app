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

  allocateDebtPayment(amount: number): { debtId: number; newAmount: number; }[] {
    let remainingAmount = amount;
    const allocations: { debtId: number; newAmount: number; }[] = [];
    const sortedDebts = this.debts.sort((a, b) => a.untilMaturityDays! - b.untilMaturityDays!);

    for (const debt of sortedDebts) {
      if (remainingAmount <= 0) break;

      const paymentAmount = Math.min(debt.amount, remainingAmount);
      allocations.push({ debtId: debt.id, newAmount: debt.amount - paymentAmount });
      remainingAmount -= paymentAmount;
    }

    return allocations;
  }
}
