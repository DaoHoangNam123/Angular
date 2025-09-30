import { Component } from '@angular/core';
import { ITreeNode } from '../../../models/treeNode.model';

@Component({
  selector: 'app-tree-tab',
  templateUrl: './tree-tab.component.html',
  styleUrls: ['./tree-tab.component.css'],
  standalone: false,
})
export class TreeTabComponent {
  public nodeDetails!: ITreeNode;
}
