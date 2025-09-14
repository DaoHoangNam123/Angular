import { Component } from '@angular/core';
import { Student } from './pages/student/student';
import { Popup } from './popup/popup';
import { Layout } from './layout/layout';
import { IStudent } from './models/student.model';
@Component({
  selector: 'app-root',
  imports: [Student, Popup, Layout],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  public selectedStudent: IStudent | null = null;
  public showDialog = false;

  onRowClick(student: IStudent) {
    this.selectedStudent = student;
    this.showDialog = true;
  }

  onDialogClose(showDialog: boolean) {
    this.showDialog = showDialog;
  }
}
