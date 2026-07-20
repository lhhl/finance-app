import type { ValidationResult, ValidationError } from '../types/error';

export abstract class BaseRequest {
  abstract validateFields(): ValidationError[];
  validate(): ValidationResult {
    const errors = this.validateFields();
    return {
      isValid: errors.some(error => !error.valid) === false,
      errors
    };
  }
}