import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITreeNode } from '../models/treeNode.model';
import { environment } from '../../environments/evironments';

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

  getTreeNodeAttributes(id: string): Observable<ITreeNode> {
    return this.http.get<ITreeNode>(`${this.baseUrl}/tree/attributes/${id}`);
  }

  getTreeNodeChildren(id: string): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`${this.baseUrl}/tree/children/${id}`);
  }

  updateTreeNodeById(id: string, data: Partial<ITreeNode>): Observable<ITreeNode> {
    return this.http.put<ITreeNode>(`${this.baseUrl}/tree/${id}`, data);
  }
}
