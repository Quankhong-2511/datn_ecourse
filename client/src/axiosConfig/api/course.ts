import { axiosClient } from 'axiosConfig/axiosClient';
import qs from 'query-string';
import { TCourses } from 'types/course';
const courseApi = {
  getCourses: (query: any) => {
    const queryStr = qs.stringify(query);
    return axiosClient.get(`/courses?${queryStr}`);
  },
  getMyCourses: (query: any) => {
    const queryStr = qs.stringify(query);
    return axiosClient.get(`/courses/user?${queryStr}`);
  },
  getDetailCourse: (id: string) => {
    return axiosClient.get(`/courses/${id}`);
  },
  createCourse: (data: {
    name: string;
    price: string;
    discount: string;
    commission: string;
    categoryName: string;
    file: string[];
  }) => {
    return axiosClient.post('/courses', data);
  },
  getCategory: () => {
    return axiosClient.get('/courses/category');
  },

  getMembersCourse: (id: string) => {
    return axiosClient.get(`/courses/${id}/members`);
  },
  inviteMember: (id: string, email: string) => {
    return axiosClient.post(`/courses/${id}/invite`, { email, role: 2 });
  },
  buyCourse: (courseId: string) => {
    return axiosClient.post('/courses/buyCourse', { courseId: Number(courseId) });
  },
  updateCourse: (id: string, data: TCourses) => {
    return axiosClient.patch(`/courses/${id}`, data);
  },
  activeUser: (uuid: string) => {
    return axiosClient.post('courses/buyCourseWithLink', { uuid });
  },
  createLink: (id: number) => {
    return axiosClient.post(`courses/${id}/createLink`);
  },
  getLevel: (id?: string) => {
    return axiosClient.get(`courses/level/${id ?? ''}`);
  },
  getCommission: () => {
    return axiosClient.get('courses/commission');
  },
};

export default courseApi;
