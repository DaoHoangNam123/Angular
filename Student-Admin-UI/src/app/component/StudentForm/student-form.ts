import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { dateFormatValidator } from '../../utils/helper';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, ReactiveFormsModule, KENDO_INPUTS, KENDO_LABELS],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css'],
})
export class StudentForm implements OnInit {
  public studentForm: FormGroup = new FormGroup({
    fullName: new FormControl('', { validators: [Validators.required] }),
    birthDay: new FormControl('', { validators: [Validators.required, dateFormatValidator()] }),
    gender: new FormControl('', { validators: [Validators.required] }),
    address: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [] }),
  });

  @Output() studentFormChange = new EventEmitter<any>();
  ngOnInit() {
    this.studentForm.valueChanges.subscribe((value) => {
      this.studentFormChange.emit(value);
    });
  }
}
