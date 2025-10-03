import { Injectable } from '@angular/core';
import { ITreeAttribute, ITreeNode } from '../models/treeNode.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TreeService } from '../api/tree.api';
import { BaseService } from './base.service';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class StudentNodeService extends BaseService {
  private readonly treeData = new BehaviorSubject<ITreeNode[]>([]);
  private readonly nodeInformation = new BehaviorSubject<ITreeNode | null>(null);
  private readonly attributesData = new BehaviorSubject<ITreeAttribute[]>([]);
  private readonly isDirty = new BehaviorSubject<boolean>(false);
  private readonly isAttributeDirty = new BehaviorSubject<boolean>(false);
  private readonly nodeFormSource = new BehaviorSubject<FormGroup | null>(null);

  treeData$ = this.treeData.asObservable();
  nodeInformation$ = this.nodeInformation.asObservable();
  attributesData$ = this.attributesData.asObservable();
  isDirty$ = this.isDirty.asObservable();
  isAttributeDirty$ = this.isAttributeDirty.asObservable();
  nodeForm$ = this.nodeFormSource.asObservable();

  constructor(private readonly api: TreeService) {
    super();
  }

  /* 
    Get Root node 
    parentId = null 
  */
  getTreeData(): void {
    this.safeSubscribe(
      this.api.getRootTreeNodeData(),
      (nodeList: ITreeNode[]) => {
        this.treeData.next(nodeList);
      },
      (error) => {
        console.error('Error fetching tree data:', error);
      }
    );
  }

  /* 
    Get attributes of node 
  */
  getTreeNodeAttributesData(id: string): void {
    if (!id) {
      console.warn('Node ID is required to fetch attributes');
      return;
    }

    this.safeSubscribe(
      this.api.getTreeNodeAttributes(id),
      (nodeList: ITreeAttribute[]) => {
        this.attributesData.next(nodeList.map((item, index) => ({ ...item, index })));
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error fetching node attributes:', error);
      }
    );
  }

  /* 
    Get node information 
  */
  onNodeClick(event: { item: { dataItem: ITreeNode } }): void {
    const node: ITreeNode = event.item.dataItem;
    if (!node) {
      console.warn('No node data available');
      return;
    }
    this.setIsDirty(false);
    this.nodeInformation.next(node);
    this.attributesData.next(node.attributes?.map((item, index) => ({ ...item, index })) || []);
  }

  /* 
    Save node information
    Fetch node list again
  */
  onSaveNode(id: string, nodeData: Partial<ITreeNode>): void {
    if (!id || !nodeData) {
      console.warn('Node ID and data are required for update');
      return;
    }

    this.safeSubscribe(
      this.api.updateTreeNodeById(id, nodeData),
      (updatedNode) => {
        this.nodeInformation.next(updatedNode);
        this.getTreeData();
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error updating node:', error);
        this.setIsDirty(false);
      }
    );
  }

  onUpdateNodeById(id: string, nodeData: Partial<ITreeNode>) {
    this.safeSubscribe(
      this.api.updateTreeNodeById(id, nodeData),
      () => {
        this.getTreeData();
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error updating node:', error);
        this.setIsDirty(false);
      }
    );
  }
  /* 
    Add node attribute
    Fetch node list again
  */
  onAddTreeAttribute(data: ITreeAttribute): void {
    if (!data || !data.nodeId) {
      console.warn('Node attribute data and nodeId are required');
      return;
    }

    this.safeSubscribe(
      this.api.addTreeNodeAttribute(data),
      () => {
        this.getTreeNodeAttributesData(data.nodeId);
        this.getTreeData();
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error adding tree attribute:', error);
        this.setIsDirty(false);
      }
    );
  }

  /* 
    Update node attribute
    Fetch node list again
  */
  onUpdateTreeAttribute(id: string, data: Partial<ITreeAttribute>): void {
    if (!id || !data) {
      console.warn('Attribute ID and data are required for update');
      return;
    }

    this.safeSubscribe(
      this.api.updateTreeNodeAttributeById(id, data),
      (updatedAttributes) => {
        this.getTreeNodeAttributesData(updatedAttributes.nodeId);
        this.getTreeData();
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error updating tree attribute:', error);
      }
    );
  }

  /* 
    Delete node attribute
    Fetch node list again
  */
  onDeleteTreeAttribute(id: string): void {
    if (!id) {
      console.warn('Attribute ID is required for deletion');
      return;
    }

    this.safeSubscribe(
      this.api.deleteTreeNodeAttribute(id),
      (deletedAttribute) => {
        this.getTreeNodeAttributesData(deletedAttribute.nodeId);
        this.getTreeData();
        this.setIsDirty(false);
      },
      (error) => {
        console.error('Error deleting tree attribute:', error);
      }
    );
  }

  setIsDirty(value: boolean): void {
    this.isDirty.next(value);
  }

  setIsAttributeDirty(value: boolean): void {
    this.isAttributeDirty.next(value);
  }

  setNodeForm(form: FormGroup) {
    this.nodeFormSource.next(form);
  }
}
