import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITreeAttribute, ITreeNode } from '../models/treeNode.model';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class TreeService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getRootTreeNodeData(): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`${this.baseUrl}/tree`);
  }

  getTreeNodeById(id: string): Observable<ITreeNode> {
    return this.http.get<ITreeNode>(`${this.baseUrl}/tree/${id}`);
  }

  getTreeNodeAttributes(id: string): Observable<ITreeAttribute[]> {
    return this.http.get<ITreeAttribute[]>(`${this.baseUrl}/tree/attributes/${id}`);
  }

  getTreeNodeChildren(id: string): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`${this.baseUrl}/tree/children/${id}`);
  }

  updateTreeNodeById(id: string, data: Partial<ITreeNode>): Observable<ITreeNode> {
    return this.http.put<ITreeNode>(`${this.baseUrl}/tree/${id}`, data);
  }

  addTreeNodeAttribute(attribute: ITreeAttribute): Observable<ITreeAttribute> {
    const id = attribute.nodeId;
    return this.http.post<ITreeAttribute>(`${this.baseUrl}/tree/attributes/${id}`, attribute);
  }

  deleteTreeNodeAttribute(id: string): Observable<ITreeAttribute> {
    return this.http.delete<ITreeAttribute>(`${this.baseUrl}/tree/attributes/${id}`);
  }

  updateTreeNodeAttributeById(
    id: string,
    data: Partial<ITreeAttribute>
  ): Observable<ITreeAttribute> {
    return this.http.put<ITreeAttribute>(`${this.baseUrl}/tree/attributes/${id}`, data);
  }
}
