import { Socket } from 'socket.io-client';
import { create } from 'zustand';

type TSocketStore = {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
};

const socketStore = create<TSocketStore>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
}));

export default socketStore;
