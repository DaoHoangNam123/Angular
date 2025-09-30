import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { ITreeAttribute } from '../../../models/treeNode.model';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-tree-attribute',
  templateUrl: './tree-attribute.component.html',
  styleUrls: ['./tree-attribute.component.css'],
  standalone: false,
})
export class TreeAttributeComponent implements OnInit, OnDestroy {
  public gridData!: GridDataResult;
  public subscription = new Subscription();
  constructor(
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private readonly studentNodeService: StudentNodeService
  ) {}

  /* 
    Call API to save edit attribute 
  */
  onSave(data: ITreeAttribute) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please edit node details',
      content: 'Are you sure you want save this attribute?',
      actions: [{ text: 'Cancel' }, { text: 'Edit', themeColor: 'primary' }],
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Edit') {
        this.subscription.add(
          this.studentNodeService.onUpdateTreeAttribute(data.id, { value: data.value })
        );
      }
    });
  }

  /* 
    Click delete button 
  */
  onDelete(data: ITreeAttribute) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please confirm deletion',
      content: `Are you sure you want to delete this attribute?`,
      actions: [{ text: 'Cancel' }, { text: 'Delete', themeColor: 'primary' }],
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Delete') {
        this.subscription.add(this.studentNodeService.onDeleteTreeAttribute(data.id));
      }
    });
  }

  ngOnInit(): void {
    this.studentNodeService.attributesData$.subscribe((attributes) => {
      this.gridData = attributes;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
