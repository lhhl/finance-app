import validator from 'validator';
import type { ValidationError } from '../types/error';
import { BaseRequest } from './base-request';

export class SelectIdRequest extends BaseRequest {
  constructor(private id: string, private max: number) {
    super();
  }

  get idValue(): number {
    return parseInt(this.id);
  }

  validateFields(): ValidationError[]{
    return [
      {
        valid: validator.isInt(this.id, { min: 1, max: this.max }),
        message: `Số thứ tự phải từ 1 đến ${this.max}.`
      }
    ]
  }
}