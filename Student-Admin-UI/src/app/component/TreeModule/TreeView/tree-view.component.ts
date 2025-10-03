import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ITreeNode } from '../../../models/treeNode.model';
import { TreeService } from '../../../api/tree.api';
import { StudentNodeService } from '../../../services/studentNode.service';
import { combineLatest, Subject, Subscription, takeUntil } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '../../../constants/app.constants';
interface NodeFormData {
  title: string;
  type: number | null;
}
@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  standalone: false,
})
export class TreeViewComponent implements OnInit, OnDestroy {
  constructor(
    private readonly api: TreeService,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorHandler: ErrorHandlerService,
    private readonly dialogService: DialogService,
    private readonly studentNodeService: StudentNodeService
  ) {}
  public subscription = new Subscription();
  public treeData: ITreeNode[] = [];
  public nodeInformation: ITreeNode | null = null;
  public form: FormGroup | null = null;
  public isDirty = false;

  private readonly destroy$ = new Subject<void>();

  public hasChildren = (item: any) => item.type && item.type === 1;
  public fetchChildren = (item: object) => {
    const node = item as ITreeNode;
    return this.api.getTreeNodeChildren(node.id);
  };

  /* 
    Click each child node 
  */
  onNodeClick(event: any, isDirty: boolean) {
    console.log(isDirty);
    if (isDirty) {
      const confirmRef: DialogRef = this.dialogService.open({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Do you want to save them before change node?',
        actions: [{ text: 'No' }, { text: 'Yes', themeColor: 'primary' }],
        width: '400px',
        height: '200px',
      });

      confirmRef.result.subscribe((result: any) => {
        if (result?.text === 'Yes' && this.form) {
          this.saveNode(this.form);
        }
        this.subscription.add(this.studentNodeService.onNodeClick(event));
      });
    } else {
      this.subscription.add(this.studentNodeService.onNodeClick(event));
    }
  }

  private validateNodeForm(form: FormGroup): boolean {
    if (form.invalid) {
      this.errorHandler.handleError(
        new Error(APP_CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR),
        'TreeViewComponent.validateNodeForm'
      );
      return false;
    }
    return true;
  }

  /* 
    Validate and call save update node API
   */
  public saveNode(form: any): void {
    if (!this.validateNodeForm(form) || !this.nodeInformation) {
      return;
    }

    const formData = {
      title: form?.title.trim() ?? '',
      type: form?.type ?? null,
    };

    try {
      this.studentNodeService.onUpdateNodeById(this.nodeInformation.id, formData);
    } catch (error) {
      this.errorHandler.handleError(error, 'TreeNodeComponent.saveNode');
    }
  }
  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription.add(this.studentNodeService.getTreeData());
    this.subscription.add(
      this.studentNodeService.isDirty$.subscribe((isDirty) => {
        this.isDirty = isDirty;
      })
    );

    combineLatest([
      this.studentNodeService.treeData$,
      this.studentNodeService.nodeInformation$,
      this.studentNodeService.nodeForm$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([data, nodeInformation, form]) => {
        this.treeData = data;
        this.nodeInformation = nodeInformation;
        this.form = form;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
