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

  public selectedStudent: IStudent | null = null;
  public isAddNew: boolean = false;
  public isEdit: boolean = false;
  public showDialog: boolean = false;

  onRowClick(student: IStudent) {
    this.selectedStudent = student;
    this.showDialog = true;
  }

  /* Dialog action yes no button */
  dialogActionButton() {
    if (this.isAddNew && this.selectedStudent) {
      this.child.onAddStudent(this.selectedStudent);
    }

    if (this.isEdit && this.selectedStudent) {
      this.child.onUpdateStudent(this.selectedStudent);
    }
    this.isAddNew = false;
    this.isEdit = false;
    this.showDialog = false;
  }

  onDialogClose() {
    this.isAddNew = false;
    this.isEdit = false;
    this.showDialog = false;
  }

  /* Click add student button */
  onClickAddStudent() {
    this.isAddNew = true;
    this.showDialog = true;
    this.selectedStudent = null;
  }

  onFormChange(form: IStudent) {
    this.selectedStudent = form;
  }

  /* Click edit button */
  onEditStudent(data: IStudent) {
    this.isEdit = true;
    this.showDialog = true;
    this.selectedStudent = data;
  }
}
