import { Component, ViewChild } from '@angular/core';
import { StudentGrid } from '../../component/StudentGrid/student-grid';
import { StudentPopup } from '../../component/StudentPopup/student-popup';
import { Header } from '../../component/Header/header';
import { IStudent } from '../../models/student.model';

@Component({
  selector: 'app-dashboard',
  imports: [StudentGrid, StudentPopup, Header],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  @ViewChild(StudentGrid) child!: StudentGrid;

  public studentForm: IStudent = {} as IStudent;
  public selectedStudent: IStudent | null = null;
  public showDialog = false;

  onRowClick(student: IStudent) {
    this.selectedStudent = student;
    this.showDialog = true;
  }

  onDialogClose(showDialog: boolean) {
    this.showDialog = showDialog;

    if (!this.selectedStudent) {
      this.child.onAddStudent(this.studentForm);
    }
  }

  onClickAddStudent() {
    this.selectedStudent = null;
    this.showDialog = true;
  }

  onFormChange(form: IStudent) {
    this.studentForm = form;
  }
}
