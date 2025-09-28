import { Component, Input } from '@angular/core';
import { IStudent } from '../../models/student.model';

@Component({
  selector: 'app-popup',
  templateUrl: './student-popup.component.html',
  styleUrls: ['./student-popup.component.css'],
  standalone: false,
})
export class StudentPopupComponent {
  @Input() public selectedStudent: IStudent | null = null;
  @Input() public showDialog = false;

  closeDialog() {
    this.showDialog = false;
  }
}
