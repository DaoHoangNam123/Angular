import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
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
@Component({
  selector: 'app-student',
  templateUrl: './student-grid.html',
  styleUrls: ['./student-grid.css'],
  imports: [CommonModule, KENDO_GRID, FormsModule],
})
export class StudentGrid implements OnInit {
  @Input() public gridData!: GridDataResult;
  @Input() public pageSize = 5;
  @Input() public skip = 0;
  @Output() public rowClick = new EventEmitter<IStudent>();

  public studentList: IStudent[] = [];

  constructor(private readonly api: StudentService, private readonly cdr: ChangeDetectorRef) {}

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

  onRowClick(event: CellClickEvent) {
    this.api.getStudentById(event.dataItem.id).subscribe({
      next: (data) => {
        this.rowClick.emit(data);
      },
      error: (err) => console.error('>>>>>>>Error', err),
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
      error: (err) => console.error('>>>>>>>Error', err),
    });
  }

  ngOnInit() {
    this.fetchStudents();
  }
}
