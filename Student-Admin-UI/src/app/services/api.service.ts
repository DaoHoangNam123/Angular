import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentData } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'https://localhost:5001/api'; // Change to your ASP.NET API URL

  constructor(private readonly http: HttpClient) {}

  getStudentList(): Observable<StudentData[]> {
    return this.http.get<StudentData[]>(`${this.baseUrl}/students`);
  }
  getStudentById(id: number): Observable<StudentData> {
    return this.http.get<StudentData>(`${this.baseUrl}/students/${id}`);
  }
}
