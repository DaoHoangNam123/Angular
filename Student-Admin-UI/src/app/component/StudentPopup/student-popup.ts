import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { IStudent } from '../../models/student.model';
import { StudentForm } from '../StudentForm/student-form';

@Component({
  selector: 'app-popup',
  imports: [CommonModule, DialogModule, ButtonModule, StudentForm],
  templateUrl: './student-popup.html',
  styleUrls: ['./student-popup.css'],
})
export class StudentPopup {
  @Input() public selectedStudent: IStudent | null = null;
  @Input() public showDialog = false;
  @Input() public isAddNew = false;
  @Input() public isEdit = false;

  @Output() public dialogClose = new EventEmitter<boolean>();
  @Output() public dialogActionButton = new EventEmitter<boolean>();
  @Output() public formChange = new EventEmitter<IStudent>();

  onFormChange(form: IStudent) {
    this.formChange.emit(form);
  }

  closeDialog() {
    this.dialogClose.emit(false);
  }

  onClickActionButton() {
    this.dialogActionButton.emit(false);
  }
}
