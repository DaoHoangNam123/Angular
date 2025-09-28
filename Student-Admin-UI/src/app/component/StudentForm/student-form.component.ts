import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateFormatValidator, formatDate } from '../../utils/helper';
import { IStudent } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
  standalone: false,
})
export class StudentFormComponent implements OnInit {
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
