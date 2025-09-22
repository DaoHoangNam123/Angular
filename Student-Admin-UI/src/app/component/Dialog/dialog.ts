import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-dialog',
  imports: [KENDO_DIALOGS, KENDO_BUTTONS],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class Dialog {
  @Input() title!: string;
  @Output() deleteStudent = new EventEmitter<string>();
  public dialogOpened!: boolean;

  public action(status: string) {
    this.dialogOpened = false;
    this.deleteStudent.emit(status);
  }

  public toggle() {
    this.dialogOpened = !this.dialogOpened;
  }
}
