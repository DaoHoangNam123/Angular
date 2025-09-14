import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  CellClickEvent,
  GridDataResult,
  KENDO_GRID,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { ApiService } from '../../services/api.service';
import { IStudent } from '../../models/student.model';
import customers from '../../dummyData';
@Component({
  selector: 'app-student',
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
  imports: [KENDO_GRID, FormsModule],
})
export class Student implements OnInit {
  @Input() public gridData!: GridDataResult;
  @Input() public pageSize = 5;
  @Input() public skip = 0;

  @Output() public rowClick = new EventEmitter<IStudent>();

  public items: IStudent[] = [];
  constructor(private readonly api: ApiService) {
    this.loadItems();
  }

  private loadItems() {
    this.gridData = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length,
    };
  }

  onRowClick(event: CellClickEvent) {
    this.rowClick.emit(event.dataItem as IStudent);
  }

  onPageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this.loadItems();
  }

  ngOnInit() {
    this.api.getStudentList().subscribe({
      next: (data) => {
        this.items = data;
        this.loadItems();
        console.log('Fetched students:', this.items);
      },
      error: (err) => console.error('Error fetching students:', err),
    });
  }
}
