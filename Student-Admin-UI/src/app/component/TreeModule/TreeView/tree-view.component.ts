import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ITreeNode } from '../../../models/treeNode.model';
import { TreeService } from '../../../api/tree.api';
import { StudentNodeService } from '../../../services/studentNode.service';
import { Subscription } from 'rxjs';

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
    private readonly studentNodeService: StudentNodeService
  ) {}
  public subscription = new Subscription();
  public treeData: ITreeNode[] = [];

  public hasChildren = (item: any) => item.type && item.type === 1;
  public fetchChildren = (item: object) => {
    const node = item as ITreeNode;
    return this.api.getTreeNodeChildren(node.id);
  };

  /* 
    Click each child node 
  */
  onNodeClick(event: any) {
    this.subscription.add(this.studentNodeService.onNodeClick(event));
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.subscription.add(this.studentNodeService.getTreeData());
    this.studentNodeService.treeData$.subscribe((data) => {
      this.treeData = data;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
