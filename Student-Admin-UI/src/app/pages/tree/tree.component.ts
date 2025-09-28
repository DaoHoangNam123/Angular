import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { TreeService } from '../../api/tree.api';
import { ITreeNode } from '../../models/treeNode.model';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ToasterComponent } from '../../component/Toaster/toaster.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  standalone: false,
  template: `<input matInput class="node-info__field" [(ngModel)]="title" />`,
})
export class TreeComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  constructor(
    private readonly api: TreeService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialogService: DialogService
  ) {}

  public subscription = new Subscription();
  public gridData!: GridDataResult;
  public selectedNode: ITreeNode | null = null;
  public title: string | null = null;
  public type: number | null = null;
  public treeData: ITreeNode[] = [];
  public types = [0, 1].map((i) => ({ id: i, name: i === 1 ? 'Folder' : 'File' }));

  public hasChildren = (item: any) => item.type && item.type === 1;
  public fetchChildren = (item: object) => {
    const node = item as ITreeNode;
    return this.api.getTreeNodeChildren(node.id);
  };

  public fetchTreeList() {
    this.subscription.add(
      this.api.getRootTreeNodeData().subscribe({
        next: (nodeList: ITreeNode[]) => {
          this.treeData = nodeList;
          this.cdr.detectChanges();
        },
      })
    );
  }
  public content = () => `<input matInput class="node-info__field" [(ngModel)]="title" />`;

  /* Call API to edit attribute */
  onEdit(data: ITreeNode) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please edit node details',
      content: this.content,
      actions: [{ text: 'Cancel' }, { text: 'Edit', themeColor: 'primary', disabled: true }],
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Edit') {
        const updatedNode = { ...data, title: this.title, type: this.type };
        return updatedNode;
      }
      return null;
    });
  }

  /* Call API to delete attribute */
  onClickDelete(status: string) {
    if (status == 'yes' && this.selectedNode) {
      console.log('Deleting node:', this.selectedNode);
    }
  }

  /* Click delete button */
  onDelete(data: ITreeNode) {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please confirm deletion',
      content: `Are you sure you want to delete this attribute?`,
      actions: [{ text: 'Cancel' }, { text: 'Delete', themeColor: 'primary' }],
    });

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Delete') {
        this.selectedNode = data;
        this.onClickDelete('yes');
      }
    });
  }

  onNodeClick(event: any) {
    const node: ITreeNode = event.item.dataItem;
    this.selectedNode = node;
    this.title = node.title;
    this.type = node.type;

    this.gridData = {
      data: node.attributes.map((item, index) => ({ ...item, index })),
      total: node.attributes.length,
    };

    this.cdr.detectChanges();
  }

  saveNode() {
    if (this.selectedNode) {
      this.subscription.add(
        this.api
          .updateTreeNodeById(this.selectedNode.id, { title: this.title, type: this.type })
          .subscribe({
            next: (updatedNode) => {
              this.fetchTreeList();
              this.cdr.detectChanges();
              console.log('Node updated successfully:', updatedNode);
            },
            error: (error) => {
              console.error('Error updating node:', error);
            },
          })
      );
    }
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.fetchTreeList();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
