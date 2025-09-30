import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentNodeService } from '../../../services/studentNode.service';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { TreeTabComponent } from '../TreeTab/tree-tab.component';
import { ITreeNode } from '../../../models/treeNode.model';

@Component({
  selector: 'app-tree-node-information',
  templateUrl: './tree-node-information.component.html',
  styleUrls: ['./tree-node-information.component.css'],
  standalone: false,
})
export class TreeNodeInformationComponent implements OnInit, OnDestroy {
  constructor(private readonly studentNodeService: StudentNodeService) {}

  public title: string | null = null;
  public type: number | null = null;
  public types = [
    { id: 1, name: 'Folder' },
    { id: 0, name: 'File' },
  ];
  public subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.studentNodeService.nodeInformation$.subscribe((node) => {
        this.title = node?.title ?? null;
        this.type = node?.type ?? null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
