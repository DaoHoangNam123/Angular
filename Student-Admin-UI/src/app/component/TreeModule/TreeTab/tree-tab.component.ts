import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ITreeNode } from '../../../models/treeNode.model';
import { formatDate } from '../../../utils/helper';
import { AuthService, User } from '../../../services/auth.service';
import { TreeNodeInformationComponent } from '../TreeNodeInformation/tree-node-information.component';
import { TreeAttributeComponent } from '../TreeAttribute/tree-attribute.component';

@Component({
  selector: 'app-tree-tab',
  templateUrl: './tree-tab.component.html',
  styleUrls: ['./tree-tab.component.css'],
  standalone: false,
})
export class TreeTabComponent implements OnInit, OnDestroy {
  @ViewChild(TreeNodeInformationComponent) nodeInfor!: TreeNodeInformationComponent;
  @ViewChild(TreeAttributeComponent) attributeList!: TreeAttributeComponent;

  @Input() nodeDetails: ITreeNode | null = null;
  @Input() isReadOnly: boolean = true;

  public owner: string = '';
  public submissionDate: string = '';

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.owner = this.auth.getUser();
    this.submissionDate = formatDate(new Date());
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.auth
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          this.owner = user.userName;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
