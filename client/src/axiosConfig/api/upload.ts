import { axiosClient } from 'axiosConfig/axiosClient';

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
const uploadApi = {
  upload: (data: FormData) => {
    return axiosClient.post(`/files/upload`, data, config);
  },
};

export default uploadApi;
