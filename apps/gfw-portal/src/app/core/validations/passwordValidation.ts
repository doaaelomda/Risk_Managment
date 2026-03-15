import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const errors: string[] = [];

  if (!/[A-Z]/.test(value)) {
    errors.push("missing_uppercase");
  }

  if (!/[a-z]/.test(value)) {
    errors.push("missing_lowercase");
  }

  if (!/[0-9]/.test(value)) {
    errors.push("missing_number");
  }

  if (!/[\W_]/.test(value)) {
    errors.push("missing_special");
  }

  if (value.length < 8) {
    errors.push("min_length");
  }

  return errors.length > 0 ? { passwordErrors: errors } : null;
}
