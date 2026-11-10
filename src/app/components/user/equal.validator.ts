import { AbstractControl, FormGroup } from "@angular/forms";

export const equalValidator = (controlName: string, matchingControlName: string) => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const formGroup = control as FormGroup;
    const controlToCompare = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.value && matchingControl.value !== controlToCompare.value) {
      matchingControl.setErrors({ notEqual: true });
    }

    return null;
  };
};