import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CellClickEvent,
  GridDataResult,
  KENDO_GRID,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { IStudent } from '../../models/student.model';
import { mappingDataToUI } from '../../utils/mappingData';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Toaster } from '../Toaster/toaster';
import { Dialog } from '../Dialog/dialog';
import { StudentService } from '../../api/student.api';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-student',
  templateUrl: './student-grid.html',
  styleUrls: ['./student-grid.css'],
  imports: [CommonModule, KENDO_GRID, Toaster, Dialog],
})
export class StudentGrid implements OnInit {
  @ViewChild(Toaster) toaster!: Toaster;
  @ViewChild(Dialog) dialog!: Dialog;

  @Input() public gridData!: GridDataResult;
  @Input() public pageSize = 5;
  @Input() public skip = 0;
  @Output() public rowClick = new EventEmitter<IStudent>();
  @Output() public editStudent = new EventEmitter<IStudent>();

  public studentList: IStudent[] = [];
  public selectedItem: IStudent | null = null;

  constructor(
    private readonly api: StudentService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  private _loadItems() {
    this.gridData = {
      data: this.studentList.slice(this.skip, this.skip + this.pageSize),
      total: this.studentList.length,
    };
  }
  /* Call API to add student */
  onAddStudent(studentForm: IStudent) {
    this.api.addStudent(studentForm).subscribe({
      next: () => {
        this.fetchStudents();
        this.toaster.showNotification('success', 'Student added successfully.');
        this.cdr.detectChanges();
      },
    });
  }

  /* Call API to update student */
  onUpdateStudent(studentForm: IStudent) {
    this.api.updateStudent(studentForm.id, studentForm).subscribe({
      next: () => {
        this.fetchStudents();
        this.toaster.showNotification('success', 'Student updated successfully.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toaster.showNotification('error', 'Failed to update student.');
      },
    });
  }

  /* Call API to get student details */
  onRowClick(event: CellClickEvent) {
    this.api.getStudentById(event.dataItem.id).subscribe({
      next: (data) => {
        this.rowClick.emit(data);
      },
      error: (err) => console.error('>>>>>>>Error', err),
    });
  }

  onEdit(data: IStudent) {
    this.editStudent.emit(data);
  }

  /* Call API to delete student */
  onClickDeleteStudent(status: string) {
    if (status == 'yes' && this.selectedItem) {
      this.api.deleteStudent(this.selectedItem.id).subscribe({
        next: () => {
          this.fetchStudents();
          this.toaster.showNotification('success', 'Student deleted successfully.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toaster.showNotification('error', 'Failed to delete student.');
        },
      });
    }
    this.selectedItem = null;
  }

  /* Click delete button */
  onDelete(data: IStudent) {
    this.selectedItem = data;
    this.dialog.toggle();
  }

  /* Click next page */
  onPageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this._loadItems();
  }

  /* Fetch student list from API */
  fetchStudents() {
    this.api.getStudentList().subscribe({
      next: (data) => {
        this.studentList = mappingDataToUI(data);
        this._loadItems();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status == 401 || err.status == 0) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  ngOnInit() {
    this.fetchStudents();
  }
}
