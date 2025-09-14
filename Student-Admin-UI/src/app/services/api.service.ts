import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStudent } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5083/api';

  constructor(private readonly http: HttpClient) {}

  getStudentList(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.baseUrl}/students`);
  }
  getStudentById(id: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.baseUrl}/students/${id}`);
  }
}
