import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CellClickEvent,
  GridDataResult,
  KENDO_GRID,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { StudentService } from '../../services/student.service';
import { IStudent } from '../../models/student.model';
import { mappingDataToUI } from '../../utils/mappingData';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student',
  templateUrl: './student-grid.html',
  styleUrls: ['./student-grid.css'],
  imports: [CommonModule, KENDO_GRID],
})
export class StudentGrid implements OnInit {
  @Input() public gridData!: GridDataResult;
  @Input() public pageSize = 5;
  @Input() public skip = 0;
  @Output() public rowClick = new EventEmitter<IStudent>();
  @Output() public editStudent = new EventEmitter<IStudent>();

  public studentList: IStudent[] = [];

  constructor(
    private readonly api: StudentService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  private _loadItems() {
    this.gridData = {
      data: this.studentList.slice(this.skip, this.skip + this.pageSize),
      total: this.studentList.length,
    };
  }

  onAddStudent(studentForm: IStudent) {
    this.api.addStudent(studentForm).subscribe({
      next: () => {
        this.fetchStudents();
        this.cdr.detectChanges();
      },
    });
  }

  onUpdateStudent(studentForm: IStudent) {
    this.api.updateStudent(studentForm.id, studentForm).subscribe({
      next: () => {
        this.fetchStudents();
        this.cdr.detectChanges();
      },
    });
  }

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

  onDelete(data: IStudent) {
    console.log(data);
    this.api.deleteStudent(data.id).subscribe({
      next: () => {
        this.fetchStudents();
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this._loadItems();
  }

  fetchStudents() {
    this.api.getStudentList().subscribe({
      next: (data) => {
        this.studentList = mappingDataToUI(data);
        this._loadItems();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('>>>>>>>Error', err);
        if (err.status == 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  ngOnInit() {
    this.fetchStudents();
  }
}
