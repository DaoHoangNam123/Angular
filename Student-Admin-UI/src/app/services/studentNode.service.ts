import { Injectable } from '@angular/core';
import { ITreeAttribute, ITreeNode } from '../models/treeNode.model';
import { BehaviorSubject } from 'rxjs';
import { TreeService } from '../api/tree.api';

@Injectable({ providedIn: 'root' })
export class StudentNodeService {
  private readonly treeData = new BehaviorSubject<ITreeNode[]>([]);
  private readonly nodeInformation = new BehaviorSubject<ITreeNode | null>(null);
  private readonly attributesData = new BehaviorSubject<{ data: ITreeAttribute[]; total: number }>({
    data: [],
    total: 0,
  });

  treeData$ = this.treeData.asObservable();
  nodeInformation$ = this.nodeInformation.asObservable();
  attributesData$ = this.attributesData.asObservable();

  constructor(private readonly api: TreeService) {}

  /* 
    Get Root node 
    parentId = null 
  */
  getTreeData() {
    this.api.getRootTreeNodeData().subscribe({
      next: (nodeList: ITreeNode[]) => {
        this.treeData.next(nodeList);
      },
    });
  }

  /* 
    Get node information 
  */
  onNodeClick(event: any) {
    const node: ITreeNode = event.item.dataItem;
    this.nodeInformation.next(node);

    this.attributesData.next({
      data: node.attributes.map((item, index) => ({ ...item, index })),
      total: node.attributes.length,
    });
  }

  /* 
    Save node information
    Fetch node list again
  */
  onSaveNode(id: string, nodeData: any) {
    this.api.updateTreeNodeById(id, nodeData).subscribe({
      next: (updatedNode) => {
        this.getTreeData();
        console.log('>>>>>>>>>>>>>> saved successfully:', updatedNode);
      },
      error: (error) => {
        console.error('>>>>>>>>>>>>>> error save node:', error);
      },
    });
  }

  /* 
    Update node attribute
  */
  onUpdateTreeAttribute(id: string, data: any) {
    this.api.updateTreeNodeAttributeById(id, data).subscribe({
      next: (updatedAttributes) => {
        this.getTreeData();
        console.log('>>>>>>>>>>>>>> updated successfully:', updatedAttributes);
      },
    });
  }

  /* 
    Delete node attribute
  */
  onDeleteTreeAttribute(id: string) {
    this.api.deleteTreeNodeAttribute(id).subscribe({
      next: (deletedAttribute) => {
        console.log('>>>>>>>>>>>>>>  deleted successfully:', deletedAttribute);
      },
    });
  }
}
