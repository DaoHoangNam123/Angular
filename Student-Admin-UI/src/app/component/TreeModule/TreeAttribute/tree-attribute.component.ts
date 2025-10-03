import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { Subject, takeUntil } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { ITreeAttribute, ITreeNode } from '../../../models/treeNode.model';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { APP_CONSTANTS } from '../../../constants/app.constants';

interface AttributeFormData {
  key: string;
  value: string;
}

@Component({
  selector: 'app-tree-attribute',
  templateUrl: './tree-attribute.component.html',
  styleUrls: ['./tree-attribute.component.css'],
  standalone: false,
})
export class TreeAttributeComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid!: GridComponent;
  @Input() readonly: boolean = true;
  @Input() selectedNode: ITreeNode | null = null;

  public gridData: ITreeAttribute[] = [];
  public formGroup: FormGroup | undefined = undefined;
  public isNew = false;
  public loading = false;

  private readonly destroy$ = new Subject<void>();
  private editedRowIndex: number | undefined = undefined;

  constructor(
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private readonly studentNodeService: StudentNodeService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  /* 
    Click Add button
   */
  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);

    this.formGroup = this.createAttributeForm();
    this.setupFormChangeListener();
    this.isNew = true;
    args.sender.addRow(this.formGroup);
  }

  /* 
    Click Edit button
   */
  public editHandler(args: EditEvent): void {
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = this.createAttributeForm(dataItem);
    this.setupFormChangeListener();
    this.editedRowIndex = args.rowIndex;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  /* 
    Click Cancel button
   */
  public cancelHandler(args: CancelEvent): void {
    this.studentNodeService.setIsAttributeDirty(false);
    this.closeEditor(args.sender, args.rowIndex);
  }

  /* 
    Click Save button
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
    if (!this.validateForm(formGroup)) {
      return;
    }

    const formData: AttributeFormData = formGroup.value;

    try {
      if (isNew) {
        this.addAttribute(dataItem, formData);
      } else {
        this.updateAttribute(dataItem, formData);
      }

      this.studentNodeService.setIsAttributeDirty(false);
      sender.closeRow(rowIndex);
    } catch (error) {
      this.errorHandler.handleError(error, 'TreeAttributeComponent.saveHandler');
    }
  }

  /* 
    Click Remove button
   */
  public removeHandler(args: RemoveEvent): void {
    const { dataItem } = args;
    this.confirmDelete(dataItem);
  }

  private createAttributeForm(data?: Partial<ITreeAttribute>): FormGroup {
    return new FormGroup({
      key: new FormControl(data?.key || '', [Validators.required]),
      value: new FormControl(data?.value || '', [Validators.required]),
      id: new FormControl(data?.id || ''),
    });
  }

  private setupFormChangeListener(): void {
    if (this.formGroup) {
      this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.studentNodeService.setIsAttributeDirty(this.formGroup?.dirty || false);
      });
    }
  }

  private validateForm(formGroup: FormGroup): boolean {
    if (formGroup.invalid) {
      this.errorHandler.handleError(
        new Error(APP_CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR),
        'TreeAttributeComponent.validateForm'
      );
      return false;
    }
    return true;
  }

  /* 
    Add new attribute API
   */
  private addAttribute(dataItem: ITreeAttribute, formData: AttributeFormData): void {
    if (!this.selectedNode?.id) {
      throw new Error('No selected node available for adding attribute');
    }

    const newAttribute: ITreeAttribute = {
      id: '',
      nodeId: this.selectedNode.id,
      key: formData.key.trim(),
      value: formData.value.trim(),
      node: this.selectedNode,
    };

    this.studentNodeService.onAddTreeAttribute(newAttribute);
  }

  /* 
    Update attribute API
   */
  private updateAttribute(dataItem: ITreeAttribute, formData: AttributeFormData): void {
    if (!dataItem.id) {
      throw new Error('Attribute ID is required for update');
    }

    const updateData: Partial<ITreeAttribute> = {
      key: formData.key.trim(),
      value: formData.value.trim(),
    };

    this.studentNodeService.onUpdateTreeAttribute(dataItem.id, updateData);
  }

  /* 
    Confirm delete attribute
   */
  private confirmDelete(attribute: ITreeAttribute): void {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the attribute "${attribute.key}"?`,
      actions: [{ text: 'Cancel' }, { text: 'Delete', themeColor: 'primary' }],
    });

    dialogRef.result.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      if (result?.text === 'Delete') {
        this.deleteAttribute(attribute);
      }
    });
  }

  /* 
    Call delete attribute API
   */
  private deleteAttribute(attribute: ITreeAttribute): void {
    if (!attribute.id) {
      this.errorHandler.handleError(
        new Error('Attribute ID is required for deletion'),
        'TreeAttributeComponent.deleteAttribute'
      );
      return;
    }

    try {
      this.studentNodeService.onDeleteTreeAttribute(attribute.id);
    } catch (error) {
      this.errorHandler.handleError(error, 'TreeAttributeComponent.deleteAttribute');
    }
  }

  /* 
    Close edit row
   */
  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isNew = false;
  }

  ngOnInit(): void {
    this.studentNodeService.attributesData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((attributes) => {
        this.gridData = attributes || [];
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
