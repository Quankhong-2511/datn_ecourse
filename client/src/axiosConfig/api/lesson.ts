import { axiosClient } from 'axiosConfig/axiosClient';
import qs from 'query-string';
import { IndexedObject } from 'types/common';

const lessonApi = {
  getListLesson: (data: IndexedObject) => {
    const qsString = qs.stringify(data);
    return axiosClient.get(`/lessons?${qsString}`);
  },
  createLesson: (data: IndexedObject) => {
    return axiosClient.post(`/lessons`, data);
  },
  comment: (data: IndexedObject) => {
    return axiosClient.post(`/lessons/comment`, data);
  },
  detail: (id: string) => {
    return axiosClient.get(`/lessons/${id}`);
  },
  update: (id: number, data: IndexedObject) => {
    return axiosClient.patch(`/lessons/${id}`, data);
  },
  accept: (id: number, status: string, data?: IndexedObject) => {
    const qsString = qs.stringify({
      id,
      status,
    });

    return axiosClient.patch(`/lessons/updateStatus?${qsString}`, data);
  },
};

export default lessonApi;
