import { formatCurrency, formatDate } from "../utils/format";
import { Contact } from "./contact";
import { Debt } from "./debt";
import { Fund } from "./fund";

export class FeeCharge {
  id: number;
  amount: number;
  debts?: Debt;
  funds?: Fund;
  contact?: Contact;

  constructor(feeCharge: FeeCharge) {
    this.id = feeCharge.id;
    this.amount = feeCharge.amount;
    this.debts = feeCharge.debts ? new Debt(feeCharge.debts) : undefined;
    this.funds = feeCharge.funds ? new Fund(feeCharge.funds) : undefined;
    this.contact = feeCharge.contact ? new Contact(feeCharge.contact) : undefined;
  }
}
