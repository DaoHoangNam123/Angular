import { Component, OnInit, ViewChild } from '@angular/core';
import { ITreeNode } from '../../../models/treeNode.model';
import { formatDate } from '../../../utils/helper';
import { AuthService } from '../../../services/auth.service';
import { TreeNodeInformationComponent } from '../TreeNodeInformation/tree-node-information.component';
import { TreeAttributeComponent } from '../TreeAttribute/tree-attribute.component';

@Component({
  selector: 'app-tree-tab',
  templateUrl: './tree-tab.component.html',
  styleUrls: ['./tree-tab.component.css'],
  standalone: false,
})
export class TreeTabComponent implements OnInit {
  @ViewChild(TreeNodeInformationComponent) nodeInfor!: TreeNodeInformationComponent;
  @ViewChild(TreeAttributeComponent) attributeList!: TreeAttributeComponent;
  constructor(private readonly auth: AuthService) {}
  public nodeDetails: ITreeNode | null = null;
  public owner!: string;
  public submissionDate: string = formatDate(new Date());
  public isReadOnly: boolean = true;
  ngOnInit() {
    this.owner = this.auth.getUser();
  }
}
