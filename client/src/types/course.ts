import { IndexedObject } from 'types/common';
import { TUser } from 'types/user';

export type TCategory = {
  id?: number;
  title?: string;
};
export type TCourses = {
  id?: number;
  courseId?: number;
  name?: string;
  price?: string;
  discount?: string;
  commission?: number;
  categoryName?: string;
  category?: string;
  file?: any[];
  course?: TCourses;
  lastPrice?: number;
  user?: TUser;
  content?: string;
  revenue?: number
};

export type TLesson = {
  commentsTop?: null;
  content?: string;
  courseId?: number;
  createdAt?: Date;
  createdBy?: 1;
  file?: { name: string; path: string }[];
  user?: TUser;
  id?: number;
  name?: string;
  publish?: 1;
  tag?: string;
  title?: string;
  status?: string;
  course?: TCourses;
  comments?: IndexedObject[];
};
