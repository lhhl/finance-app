import validator from 'validator';
import type { ValidationError } from '../types/error';
import { BaseRequest } from './base-request';

export class AddDebtRequest extends BaseRequest {
  amount: string;
  fund_id: number;
  contact_id: number;

  constructor(amount: string, fund_id: number, contact_id: number) {
    super();
    this.amount = amount;
    this.fund_id = fund_id;
    this.contact_id = contact_id;
  }

  validateFields(): ValidationError[]{
    return [];
  }
}