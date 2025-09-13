import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { GridDataResult, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import customers from '../../dummyData';
import { ApiService } from '../../services/api.service';
import { StudentData } from '../../models/student.model';
@Component({
  selector: 'app-student',
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
  imports: [KENDO_GRID, FormsModule],
})
export class Student implements OnInit {
  public gridView!: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private items: StudentData[] = customers;

  constructor(private readonly api: ApiService) {
    this.loadItems();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length,
    };
  }

  ngOnInit() {
    this.api.getStudentList().subscribe({
      next: (data) => (this.items = data),
      error: (err) => console.error('Error fetching students:', err),
    });
  }
}
