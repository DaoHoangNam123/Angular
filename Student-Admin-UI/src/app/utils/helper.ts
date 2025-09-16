import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // bỏ qua nếu trống
    const regex = /^\d{2}\/\d{2}\/\d{4}$/; // dd/mm/yyyy
    const validFormat = regex.test(value);

    // Kiểm tra ngày có hợp lệ không
    const dateParts = value.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const date = new Date(year, month, day);
    const isValidDate = !isNaN(date.getTime());

    return validFormat && isValidDate ? null : { invalidDateFormat: true };
  };
}
