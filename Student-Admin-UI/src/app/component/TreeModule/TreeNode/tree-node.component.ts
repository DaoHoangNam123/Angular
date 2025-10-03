import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ITreeAttribute, ITreeNode } from '../../../models/treeNode.model';
import { StudentNodeService } from '../../../services/studentNode.service';
import { TreeNodeInformationComponent } from '../TreeNodeInformation/tree-node-information.component';
import { TreeTabComponent } from '../TreeTab/tree-tab.component';
import { TreeAttributeComponent } from '../TreeAttribute/tree-attribute.component';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { FormGroup } from '@angular/forms';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { APP_CONSTANTS } from '../../../constants/app.constants';
import { NodeAttributeFormData, NodeFormData } from '../interfaces/tree-module.interfaces';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  standalone: false,
})
export class TreeNodeComponent implements OnInit, OnDestroy {
  @ViewChild(TreeNodeInformationComponent) nodeInfor!: TreeNodeInformationComponent;
  @ViewChild(TreeAttributeComponent) treeAttribute!: TreeAttributeComponent;

  public selectedNode: ITreeNode | null = null;
  public isReadOnly: boolean = true;
  public isDirty: boolean = false;
  public isAttributeDirty: boolean = false;
  public loading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly studentNodeService: StudentNodeService,
    private readonly dialogService: DialogService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  /* 
    Click Edit Details button
   */
  editNodeDetails(): void {
    if (!this.selectedNode) {
      this.errorHandler.handleError(
        new Error('No node selected for editing'),
        'TreeNodeComponent.editNodeDetails'
      );
      return;
    }

    this.isReadOnly = false;
    this.openEditDialog();
  }

  private openEditDialog(): void {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Edit Node Details',
      content: TreeTabComponent,
      actions: [{ text: 'Cancel' }, { text: 'Save', themeColor: 'primary' }],
      width: '70vw',
      height: 'max-content',
    });

    const treeTab = dialogRef.content.instance as TreeTabComponent;
    treeTab.nodeDetails = this.selectedNode;
    treeTab.isReadOnly = false;

    dialogRef.result.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      if (result?.text === 'Save') {
        this.handleSaveDialog(treeTab);
      } else if (result?.text === 'Cancel' && this.hasUnsavedChanges()) {
        this.handleCancelDialog(treeTab);
      }
    });
  }

  /* 
    Check form is edditting
   */
  private hasUnsavedChanges(): boolean {
    return this.isDirty || this.isAttributeDirty;
  }

  /* 
      Call update API for attribute or node information
   */
  private handleSaveDialog(component: TreeTabComponent): void {
    if (this.isDirty && component.nodeInfor?.form) {
      this.saveNode(component.nodeInfor.form);
    }

    if (this.isAttributeDirty && component.attributeList.formGroup) {
      this.saveAttribute(component.attributeList.formGroup);
    }

    this.studentNodeService.setIsDirty(false);
    this.studentNodeService.setIsAttributeDirty(false);
  }

  /* 
    Click cancel dialog button
   */
  private handleCancelDialog(component: TreeTabComponent): void {
    const confirmRef: DialogRef = this.dialogService.open({
      title: 'Unsaved Changes',
      content: 'You have unsaved changes. Do you want to save them before closing?',
      actions: [{ text: 'No' }, { text: 'Yes', themeColor: 'primary' }],
      width: '400px',
      height: '200px',
    });

    confirmRef.result.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      if (result?.text === 'Yes' && component) {
        this.handleSaveDialog(component);
      }
    });
  }

  /* 
    Save attribute list API
   */
  public saveAttribute(form: FormGroup): void {
    if (!this.validateNodeForm(form)) {
      return;
    }

    if (!this.selectedNode?.id) {
      throw new Error('No selected node available for adding attribute');
    }

    const formData: NodeAttributeFormData = this.extractFormAttributeData(form);

    try {
      if (!formData.id) {
        const newAttribute: ITreeAttribute = {
          id: '',
          nodeId: this.selectedNode?.id,
          key: formData.key.trim(),
          value: formData.value.trim(),
          node: this.selectedNode,
        };

        this.studentNodeService.onAddTreeAttribute(newAttribute);
      } else {
        const updateData: Partial<ITreeAttribute> = {
          key: formData.key.trim(),
          value: formData.value.trim(),
        };

        this.studentNodeService.onUpdateTreeAttribute(formData.id, updateData);
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'TreeNodeComponent.saveNode');
    }
  }

  /* 
    Save node information API
   */
  public saveNode(form: FormGroup): void {
    if (!this.selectedNode) {
      this.errorHandler.handleError(
        new Error('No selected node available for saving'),
        'TreeNodeComponent.saveNode'
      );
      return;
    }

    if (!this.validateNodeForm(form)) {
      return;
    }

    const formData: NodeFormData = this.extractFormData(form);

    try {
      this.studentNodeService.onSaveNode(this.selectedNode.id, formData);
    } catch (error) {
      this.errorHandler.handleError(error, 'TreeNodeComponent.saveNode');
    }
  }

  private validateNodeForm(form: FormGroup): boolean {
    if (form.invalid) {
      this.errorHandler.handleError(
        new Error(APP_CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR),
        'TreeNodeComponent.validateNodeForm'
      );
      return false;
    }
    return true;
  }

  private extractFormData(form: FormGroup): NodeFormData {
    return {
      title: form.get('title')?.value?.trim() ?? '',
      type: form.get('type')?.value ?? null,
    };
  }

  private extractFormAttributeData(form: FormGroup): NodeAttributeFormData {
    return {
      key: form.get('key')?.value?.trim() ?? '',
      value: form.get('value')?.value ?? null,
      id: form.get('id')?.value ?? null,
    };
  }

  ngOnInit(): void {
    combineLatest([
      this.studentNodeService.nodeInformation$,
      this.studentNodeService.isDirty$,
      this.studentNodeService.isAttributeDirty$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([node, isDirty, isAttributeDirty]) => {
        this.selectedNode = node;
        this.isDirty = isDirty;
        this.isAttributeDirty = isAttributeDirty;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
