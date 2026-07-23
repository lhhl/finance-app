import { formatCurrency, formatDate } from "../utils/format";
import { Contact } from "./contact";
import { Debt } from "./debt";
import { Fund } from "./fund";

export class AddFeeChargeRequest {
  amount: number;
  debt_id: number;
  fund_id: number;
  contact_id: number;
  maturity_date: Date;

  constructor(request: AddFeeChargeRequest) {
    this.amount = request.amount;
    this.debt_id = request.debt_id;
    this.fund_id = request.fund_id;
    this.contact_id = request.contact_id;
    this.maturity_date = new Date(request.maturity_date);
  }
}
