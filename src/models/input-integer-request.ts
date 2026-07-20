import validator from 'validator';
import type { ValidationError } from '../types/error';
import { BaseRequest } from './base-request';

export class InputIntegerRequest extends BaseRequest {
  constructor(private amount: string, private min?: number, private max?: number) {
    super();
  }

  get intValue(): number {
    return parseInt(this.amount);
  }

  validateFields(): ValidationError[]{
    const options: validator.IsIntOptions = {};
    const messageParts: string[] = ['là một số'];
    if (this.min !== undefined) {
      options.min = this.min;
      messageParts.push(`lớn hơn hoặc bằng ${this.min}`);
    }
    if (this.max !== undefined) {
      options.max = this.max;
      messageParts.push(`nhỏ hơn hoặc bằng ${this.max}`);
    }
    return [
      {
        valid: validator.isInt(this.amount, options),
        message: `Giá trị phải ${messageParts.join(', ')}.`
      }
    ];
  }
}