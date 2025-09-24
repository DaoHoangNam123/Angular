import { Component, ViewChild } from '@angular/core';
import { StudentGrid } from '../../component/StudentGrid/student-grid';
import { Header } from '../../component/Header/header';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { StudentForm } from '../../component/StudentForm/student-form';

@Component({
  selector: 'app-dashboard',
  imports: [StudentGrid, Header],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  @ViewChild(StudentGrid) studentGrid!: StudentGrid;
  constructor(private readonly dialogService: DialogService) {}

  /* Click add student button */
  onClickAddStudent() {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please enter student details',
      content: StudentForm,
      actions: [{ text: 'Cancel' }, { text: 'Add', themeColor: 'primary', disabled: true }],
    });

    const form = dialogRef.content.instance as StudentForm;

    form.studentForm.valueChanges.subscribe(() => {
      const isValid = form.studentForm.valid;
      dialogRef.dialog.instance.actions[1].disabled = !isValid;
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Add') {
        const newStudent = form.studentForm.value;
        this.studentGrid.onAddStudent(newStudent);
      }
    });
  }
}
