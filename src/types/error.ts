export interface ValidationError {
  valid: boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}