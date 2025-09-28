import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CellClickEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { IStudent } from '../../models/student.model';
import { mappingDataToUI } from '../../utils/mappingData';
import { Router } from '@angular/router';
import { ToasterComponent } from '../Toaster/toaster.component';
import { StudentService } from '../../api/student.api';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { StudentFormComponent } from '../StudentForm/student-form.component';
import { StudentPopupComponent } from '../StudentPopup/student-popup.component';
@Component({
  selector: 'app-student',
  templateUrl: './student-grid.component.html',
  styleUrls: ['./student-grid.component.css'],
  standalone: false,
})
export class StudentGridComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(StudentPopupComponent) studentPopup!: StudentPopupComponent;

  @Input() public gridData!: GridDataResult;
  @Input() public pageSize = 5;
  @Input() public skip = 0;
  @Output() public rowClick = new EventEmitter<IStudent>();
  @Output() public editStudent = new EventEmitter<IStudent>();

  public studentList: IStudent[] = [];
  public selectedItem: IStudent | null = null;
  public showDialog: boolean = false;
  public subscription = new Subscription();

  constructor(
    private readonly api: StudentService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly dialogService: DialogService
  ) {}

  private _loadItems() {
    this.gridData = {
      data: this.studentList.slice(this.skip, this.skip + this.pageSize),
      total: this.studentList.length,
    };
  }
  /* Call API to add student */
  onAddStudent(studentForm: IStudent) {
    this.subscription.add(
      this.api.addStudent(studentForm).subscribe({
        next: () => {
          this.fetchStudents();
          this.toaster.showNotification('success', 'Student added successfully.');
          this.cdr.detectChanges();
        },
      })
    );
  }

  /* Call API to update student */
  onUpdateStudent(studentForm: IStudent) {
    this.subscription.add(
      this.api.updateStudent(studentForm.id, studentForm).subscribe({
        next: () => {
          this.fetchStudents();
          this.toaster.showNotification('success', 'Student updated successfully.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toaster.showNotification('error', 'Failed to update student.');
        },
      })
    );
  }

  /* Call API to get student details */
  onRowClick(event: CellClickEvent) {
    this.subscription.add(
      this.api.getStudentById(event.dataItem.id).subscribe({
        next: (data) => {
          this.studentPopup.selectedStudent = data;
          this.studentPopup.showDialog = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('>>>>>>>Error', err),
      })
    );
  }

  onEdit(data: IStudent) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please edit student details',
      content: StudentFormComponent,
      actions: [{ text: 'Cancel' }, { text: 'Edit', themeColor: 'primary', disabled: true }],
    });

    const form = dialogRef.content.instance as StudentFormComponent;
    form.selectedStudent = data;

    form.studentForm.valueChanges.subscribe(() => {
      const isValid = form.studentForm.valid;
      dialogRef.dialog.instance.actions[1].disabled = !isValid;
    });

    dialogRef.result.subscribe((result: any) => {
      const isValid = form.studentForm.valid;
      if (result && isValid && result.text === 'Edit') {
        const updatedStudent = form.studentForm.value;
        this.onUpdateStudent(updatedStudent);
      }
    });
  }

  /* Call API to delete student */
  onClickDeleteStudent(status: string) {
    if (status == 'yes' && this.selectedItem) {
      this.subscription.add(
        this.api.deleteStudent(this.selectedItem.id).subscribe({
          next: () => {
            this.fetchStudents();
            this.toaster.showNotification('success', 'Student deleted successfully.');
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.toaster.showNotification('error', 'Failed to delete student.');
          },
        })
      );
    }
    this.selectedItem = null;
  }

  /* Click delete button */
  onDelete(data: IStudent) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please confirm deletion',
      content: `Are you sure you want to delete this student?`,
      actions: [{ text: 'Cancel' }, { text: 'Delete', themeColor: 'primary' }],
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Delete') {
        this.selectedItem = data;
        this.onClickDeleteStudent('yes');
      }
    });
  }

  /* Click next page */
  onPageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this._loadItems();
  }

  /* Fetch student list from API */
  fetchStudents() {
    this.subscription.add(
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
      })
    );
  }

  ngOnInit() {
    this.fetchStudents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
