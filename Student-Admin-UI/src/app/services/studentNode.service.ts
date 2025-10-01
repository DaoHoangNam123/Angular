import { Injectable } from '@angular/core';
import { ITreeAttribute, ITreeNode } from '../models/treeNode.model';
import { BehaviorSubject } from 'rxjs';
import { TreeService } from '../api/tree.api';

@Injectable({ providedIn: 'root' })
export class StudentNodeService {
  private readonly treeData = new BehaviorSubject<ITreeNode[]>([]);
  private readonly nodeInformation = new BehaviorSubject<ITreeNode | null>(null);
  private readonly attributesData = new BehaviorSubject<ITreeAttribute[]>([]);
  private readonly isDirty = new BehaviorSubject<boolean>(false);
  private readonly isAttributeDirty = new BehaviorSubject<boolean>(false);

  treeData$ = this.treeData.asObservable();
  nodeInformation$ = this.nodeInformation.asObservable();
  attributesData$ = this.attributesData.asObservable();
  isDirty$ = this.isDirty.asObservable();
  isAttributeDirty$ = this.isAttributeDirty.asObservable();

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
    Get attributes of node 
  */
  getTreeNodeAttributesData(id: any) {
    this.api.getTreeNodeAttributes(id).subscribe({
      next: (nodeList: ITreeAttribute[]) => {
        this.attributesData.next(nodeList.map((item, index) => ({ ...item, index })));
      },
    });
  }

  /* 
    Get node information 
  */
  onNodeClick(event: any) {
    const node: ITreeNode = event.item.dataItem;
    this.nodeInformation.next(node);
    this.attributesData.next(node.attributes.map((item, index) => ({ ...item, index })));
  }

  /* 
    Save node information
    Fetch node list again
  */
  onSaveNode(id: string, nodeData: any) {
    this.api.updateTreeNodeById(id, nodeData).subscribe({
      next: (updatedNode) => {
        this.nodeInformation.next(updatedNode);
        this.getTreeData();
      },
    });
  }

  /* 
    Delete node attribute
    Fetch node list again
  */
  onAddTreeAttribute(data: ITreeAttribute) {
    this.api.addTreeNodeAttribute(data).subscribe({
      next: () => {
        this.getTreeNodeAttributesData(data.nodeId);
        this.getTreeData();
      },
    });
  }

  /* 
    Update node attribute
    Fetch node list again
  */
  onUpdateTreeAttribute(id: string, data: any) {
    this.api.updateTreeNodeAttributeById(id, data).subscribe({
      next: (updatedAttributes) => {
        this.getTreeNodeAttributesData(updatedAttributes.nodeId);
        this.getTreeData();
      },
    });
  }

  /* 
    Delete node attribute
    Fetch node list again
  */
  onDeleteTreeAttribute(id: string) {
    this.api.deleteTreeNodeAttribute(id).subscribe({
      next: (deletedAttribute) => {
        this.getTreeNodeAttributesData(deletedAttribute.nodeId);
        this.getTreeData();
      },
    });
  }

  setIsDirty(value: any) {
    this.isDirty.next(value);
  }

  setIsAttributeDirty(value: any) {
    this.isAttributeDirty.next(value);
  }
}
