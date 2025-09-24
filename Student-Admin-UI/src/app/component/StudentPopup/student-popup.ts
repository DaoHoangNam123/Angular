import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IStudent } from '../../models/student.model';
import { DialogModule } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-popup',
  imports: [CommonModule, ButtonModule, DialogModule, DatePipe],
  templateUrl: './student-popup.html',
  styleUrls: ['./student-popup.css'],
})
export class StudentPopup {
  @Input() public selectedStudent: IStudent | null = null;
  @Input() public showDialog = false;

  closeDialog() {
    this.showDialog = false;
  }
}
