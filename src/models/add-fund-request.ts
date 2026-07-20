import validator from 'validator';
import type { ValidationError } from '../types/error';
import { BaseRequest } from './base-request';

export class AddFundRequest extends BaseRequest {
  name: string;
  amount: number;
  statement_day?: number;
  maturity_day: number;

  constructor(name: string, amount: number, maturity_day: number, statement_day?: number) {
    super();
    this.name = name || "";
    this.amount = amount || 0;
    this.statement_day = statement_day;
    this.maturity_day = maturity_day || 15;
  }

  validateFields(): ValidationError[]{
    return [
      {
        valid: !validator.isEmpty(this.name),
        message: "Tên nguồn tiền là bắt buộc."
      },
      {
        valid: validator.isInt(this.amount.toString(), { min: 1000 }),
        message: "Số tiền phải lớn hơn 1000."
      },
      {
        valid: validator.isInt(this.maturity_day.toString(), { min: 1, max: 30 }),
        message: "Ngày đáo hạn phải từ 1 đến 30."
      },
      {
        valid: !this.statement_day || validator.isInt(this.statement_day.toString(), { min: 1, max: 30 }),
        message: "Ngày sao kê phải từ 1 đến 30."
      }
    ]
  }
}