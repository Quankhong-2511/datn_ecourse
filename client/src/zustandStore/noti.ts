import notiApi from 'axiosConfig/api/noti';
import { Socket } from 'socket.io-client';
import { TNoti } from 'types/noti';
import { create } from 'zustand';

type TNotiStore = {
  listNoti: TNoti[];
  getNotis: () => void;
};

const notiStore = create<TNotiStore>((set) => ({
  listNoti: [],
  getNotis: async () => {
    const res = await notiApi.getNotis();
    set({ listNoti: res.data.data });
  },
}));

export default notiStore;
