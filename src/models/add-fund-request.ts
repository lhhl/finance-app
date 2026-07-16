import Schema from 'validate'
import { BaseRequest } from './base-request';

export class AddFundRequest extends BaseRequest {
  name: string;
  amount: number;
  statement_day?: number;
  maturity_day: number;
  interval_months?: number;

  constructor(name: string, amount: number, maturity_day: number, statement_day?: number, interval_months?: number) {
    super();
    this.name = name || "";
    this.amount = amount || 0;
    this.statement_day = statement_day;
    this.maturity_day = maturity_day || 15;
    this.interval_months = interval_months || 1;
  }

  getSchema(): Schema {
    return new Schema({
      name: {
        type: String,
        required: true,
        message: "Tên nguồn tiền không được để trống."
      },
      amount: {
        type: Number,
        required: true,
        message: "Hạn mức (số tiền) không được để trống."
      },
      maturity_day: {
        type: Number,
        required: true,
        message: "Ngày đáo hạn không được để trống."
      },
      statement_day: {
        type: Number,
        required: false
      },
      interval_months: {
        type: Number,
        required: false
      }
    });
  }
}