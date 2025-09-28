import { Component, ViewChild } from '@angular/core';
import { StudentGridComponent } from '../../component/StudentGrid/student-grid.component';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { StudentFormComponent } from '../../component/StudentForm/student-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent {
  @ViewChild(StudentGridComponent) studentGrid!: StudentGridComponent;
  constructor(private readonly dialogService: DialogService) {}

  /* Click add student button */
  onClickAddStudent() {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please enter student details',
      content: StudentFormComponent,
      actions: [{ text: 'Cancel' }, { text: 'Add', themeColor: 'primary', disabled: true }],
    });

    const form = dialogRef.content.instance as StudentFormComponent;

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
