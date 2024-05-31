import { TLesson } from 'types/course';

export type TNoti = {
  id?: number;
  content?: string;
  createdAt?: string;
  lesson?: TLesson;
  recipients?: {
    statusCd: number;
  }[];
  type?: number;
  courseId?: number;
  lessonId?: number;
  userId?: number;
  status?: number[];
  courseName?: string;
  lessonName?: string;
};
