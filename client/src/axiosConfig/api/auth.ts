import { axiosClient } from 'axiosConfig/axiosClient';

const authApi = {
  register: (body: any) => {
    return axiosClient.post('/auth/email/register', body);
  },
  login: (body: any) => {
    return axiosClient.post('/auth/login', body);
  },
  getOtp: (data: any) => {
    return axiosClient.post('/auth/email/exists', data);
  },
  confirmOtp: (data: any) => {
    return axiosClient.post('/auth/email/login', data);
  },
  getCurrentUser: () => {
    return axiosClient.get('/auth/me');
  },
  changePassword: (data: any) => {
    return axiosClient.post('auth/changePasswordCustom', data)
  },
  forgotPassword: (data: any) => {
    return axiosClient.post('auth/forgot/password', data)
  }
};

export default authApi;
