import { axiosClient } from 'axiosConfig/axiosClient';

const notiApi = {
  getNotis: () => {
    return axiosClient.post(`/notifications`);
  },
  readAll: (id: number) => {
    return axiosClient.patch(`/notifications/read-all/${id}`);
  },
  readOneNoti: (id: number) => {
    return axiosClient.patch(`/notifications/${id}`);
  },
};

export default notiApi;
