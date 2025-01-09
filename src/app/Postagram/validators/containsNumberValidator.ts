import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function containsNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // Si el valor está vacío, no aplicar validación aquí.
    }
    // Verificar si la contraseña contiene al menos un número
    const hasNumber = /\d/.test(value);
    return hasNumber ? null : { noNumber: true };
  };
}
