import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { ITreeAttribute, ITreeNode } from '../../../models/treeNode.model';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tree-attribute',
  templateUrl: './tree-attribute.component.html',
  styleUrls: ['./tree-attribute.component.css'],
  standalone: false,
})
export class TreeAttributeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private readonly studentNodeService: StudentNodeService
  ) {}
  @ViewChild(GridComponent) grid!: GridComponent;
  @Input() readonly: boolean = true;
  @Input() selectedNode: ITreeNode | null = null;
  public gridData!: ITreeAttribute[];
  public subscription = new Subscription();
  public formGroup: FormGroup | undefined = undefined;
  private editedRowIndex: number | undefined = undefined;
  public isNew = false;

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      key: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.studentNodeService.setIsAttributeDirty(this.formGroup?.dirty);
    });
    this.isNew = true;
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    const { dataItem } = args;
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      key: new FormControl(dataItem.key, Validators.required),
      value: new FormControl(dataItem.value, Validators.required),
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.studentNodeService.setIsAttributeDirty(this.formGroup?.dirty);
    });

    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    this.studentNodeService.setIsAttributeDirty(false);
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
    const newAttribute = formGroup.value;
    console.log('>>>>>>>>>>>>>>>>>save');
    if (isNew) {
      // Call add API
      this.subscription.add(
        this.studentNodeService.onAddTreeAttribute({
          nodeId: this.selectedNode?.id,
          ...dataItem,
          ...newAttribute,
        })
      );
    } else {
      this.subscription.add(
        this.studentNodeService.onUpdateTreeAttribute(dataItem.id, {
          ...newAttribute,
        })
      );
    }
    this.studentNodeService.setIsAttributeDirty(false);
    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    const { dataItem } = args;
    this.onDelete(dataItem);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isNew = false;
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
