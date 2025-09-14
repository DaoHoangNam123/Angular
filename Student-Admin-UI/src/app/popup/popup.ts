import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { IStudent } from '../models/student.model';

@Component({
  selector: 'app-popup',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css'],
})
export class Popup {
  @Input() public selectedStudent: IStudent | null = null;
  @Input() public showDialog = false;
  @Output() public dialogClose = new EventEmitter<boolean>();

  closeDialog() {
    this.showDialog = false;
    this.dialogClose.emit(false);
  }
}
