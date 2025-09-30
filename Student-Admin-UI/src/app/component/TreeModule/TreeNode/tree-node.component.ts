import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITreeNode } from '../../../models/treeNode.model';
import { StudentNodeService } from '../../../services/studentNode.service';
import { TreeNodeInformationComponent } from '../TreeNodeInformation/tree-node-information.component';
import { TreeTabComponent } from '../TreeTab/tree-tab.component';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  standalone: false,
})
export class TreeNodeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly studentNodeService: StudentNodeService,
    private readonly dialogService: DialogService
  ) {}
  @ViewChild(TreeNodeInformationComponent) nodeInfor!: TreeNodeInformationComponent;
  public subscription = new Subscription();
  public selectedNode: ITreeNode | null = null;

  editNodeDetails() {
    const dialogRef: DialogRef = this.dialogService.open({
      title: 'Please edit node details',
      content: TreeTabComponent,
      actions: [{ text: 'Cancel' }, { text: 'Save', themeColor: 'primary' }],
    });

    const treeTab = dialogRef.content.instance as TreeTabComponent;
    const { id, title, type } = treeTab.nodeDetails;

    dialogRef.result.subscribe((result: any) => {
      if (result && result.text === 'Save') {
        this.subscription.add(
          this.studentNodeService.onSaveNode(id, {
            title,
            type,
          })
        );
      }
    });
  }
  /* 
    Click save node information button 
  */
  saveNode() {
    if (this.selectedNode) {
      console.log(this);
      this.subscription.add(
        this.studentNodeService.onSaveNode(this.selectedNode.id, {
          title: this.nodeInfor.title,
          type: this.nodeInfor.type,
        })
      );
    }
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription.add(
      this.studentNodeService.nodeInformation$.subscribe((node) => {
        this.selectedNode = node;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
