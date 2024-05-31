import { axiosClient } from 'axiosConfig/axiosClient';
import queryString from 'query-string';
import { IndexedObject } from 'types/common';

const userApi = {
  createUser: (data: any) => {
    return axiosClient.post('/user', data);
  },
  updateUser: (data: any, id: number) => {
    return axiosClient.patch(`users/${id}`, data);
  },
  deleteUser: (id: number) => {
    return axiosClient.delete(`/user/${id}`);
  },
  createStaff: (data: any) => {
    return axiosClient.post('/user/staff', data);
  },
  getListStaff: (params: any) => {
    const strParams = queryString.stringify(params);
    return axiosClient.get(`/user/staff?${strParams}`);
  },
  getListStaffDepartment: (department: number) => {
    return axiosClient.post('/user/staff-department', { department });
  },
  registerTeacher: () => {
    return axiosClient.patch('users/update-teacher');
  },
  findAllUser: () => {
    return axiosClient.get('users/findAllUser');
  },
};

export default userApi;
