import { IStudent } from '../models/student.model';

export const mappingDataToUI = (studentList: IStudent[]) => {
  if (studentList.length === 0) return [];

  return studentList.map((student, index) => ({
    ...student,
    index: index + 1,
    birthDay: new Date(student.birthDay),
  }));
};
