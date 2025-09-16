import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStudent } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly baseUrl = 'https://localhost:7276/api';

  constructor(private readonly http: HttpClient) {}

  getStudentList(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.baseUrl}/students`);
  }
  getStudentById(id: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.baseUrl}/students/${id}`);
  }
  addStudent(student: IStudent): Observable<IStudent> {
    let payload = { ...student, birthDay: new Date(student.birthDay) };
    return this.http.post<IStudent>(`${this.baseUrl}/students`, payload);
  }
}
