import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { dateFormatValidator, formatDate } from '../../utils/helper';
import { IStudent } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, ReactiveFormsModule, KENDO_INPUTS, KENDO_LABELS],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css'],
})
export class StudentForm implements OnInit {
  @Output() studentFormChange = new EventEmitter<any>();
  @Input() selectedStudent: IStudent | null = null;
  @Input() isReadOnly: boolean = false;

  public studentForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    index: new FormControl(''),
    fullName: new FormControl('', { validators: [Validators.required] }),
    birthDay: new FormControl('', {
      validators: [Validators.required, dateFormatValidator()],
    }),
    gender: new FormControl('', { validators: [Validators.required] }),
    address: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl(''),
  });

  ngOnInit() {
    if (this.selectedStudent) {
      this.studentForm.patchValue({
        ...this.selectedStudent,
        birthDay: formatDate(this.selectedStudent.birthDay),
      });
    }

    if (this.studentForm) {
      this.studentForm.valueChanges.subscribe((value) => {
        this.studentFormChange.emit(value);
      });
    }
  }
}
