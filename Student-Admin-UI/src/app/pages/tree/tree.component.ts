import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { TreeService } from '../../api/tree.api';
import { ITreeAttribute, ITreeNode } from '../../models/treeNode.model';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ToasterComponent } from '../../component/Toaster/toaster.component';
import { StudentNodeService } from '../../services/studentNode.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  standalone: false,
})
export class TreeComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  constructor(
    private readonly api: TreeService,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly studentNodeService: StudentNodeService
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

  /* 
    Click each child node 
  */
  onNodeClick(event: any) {
    this.selectedNode = event.item.dataItem;
    this.subscription.add(this.studentNodeService.onNodeClick(event));
  }

  /* 
    Click save node information button 
  */
  saveNode() {
    if (this.selectedNode) {
      this.subscription.add(
        this.studentNodeService.onSaveNode(this.selectedNode.id, {
          title: this.title,
          type: this.type,
        })
      );
    }
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription.add(this.studentNodeService.getTreeData());

    this.studentNodeService.treeData$.subscribe((data) => {
      this.treeData = data;
      this.cdr.detectChanges();
    });

    this.studentNodeService.attributesData$.subscribe((attributes) => {
      this.gridData = attributes;
      this.cdr.detectChanges();
    });

    this.studentNodeService.nodeInformation$.subscribe((node) => {
      this.title = node.title;
      this.type = node.type;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
