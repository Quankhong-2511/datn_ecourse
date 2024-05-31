import courseApi from 'axiosConfig/api/course';
import lessonApi from 'axiosConfig/api/lesson';
import { IndexedObject } from 'types/common';
import { TCategory, TCourses, TLesson } from 'types/course';
import { create } from 'zustand';

export type TLoadingAuth = 'update-user' | '';

type TCourseStore = {
  loading: boolean;
  listCategory: TCategory[];
  listCourses: TCourses[];
  listMyCourses: TCourses[];
  totalHome: number;
  lessons: TLesson[];
  course: TCourses;
  keyword: string;
  category: string | number;
  setKeyword: (word: string) => void;
  saveListCategory: (list: TCategory[]) => void;
  getListCourses: (query: IndexedObject) => Promise<void>;
  getListMyCourses: (query: IndexedObject) => Promise<void>;
  getLessonsCourse: (query: IndexedObject) => void;
  getDetailCourse: (id: string) => void;
  saveCourse: (course: TCourses) => void;
  saveCategory: (cate: number | string) => void;
};

const courseStore = create<TCourseStore>((set) => ({
  loading: false,
  listCategory: [],
  listCourses: [],
  listMyCourses: [],
  totalHome: 0,
  lessons: [],
  keyword: '',
  category: '',
  course: {},
  saveCategory: (cate: number | string) => {
    set({ category: cate });
  },
  setKeyword: (word: string) => {
    set({ keyword: word });
  },
  saveListCategory: (list: TCategory[]) => {
    set({
      listCategory: list,
    });
  },
  getListCourses: async (query: IndexedObject) => {
    const res = await courseApi.getCourses(query);
    const { items, page, limit, total } = res.data.data;
    set({ listCourses: items, totalHome: total });
  },
  getListMyCourses: async (query: IndexedObject) => {
    const res = await courseApi.getMyCourses(query);
    set({ listMyCourses: res.data });
  },
  getLessonsCourse: async (query: IndexedObject) => {
    const res = await lessonApi.getListLesson(query);
    const { items } = res.data.data;
    set({ lessons: items });
  },
  getDetailCourse: async (id: string) => {
    const res = await courseApi.getDetailCourse(id);
    set({ course: res.data.data });
  },
  saveCourse: (course: TCourses) => {
    set({ course });
  },
}));

export default courseStore;
